/**
 * @author Cristobal Barba
 */

define([ "dojo", "dojo/router", "dijit/registry", "dijit/form/Button", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/form/SimpleTextarea",
    "dijit/form/Select", "dijit/form/CheckBox", "dijit/form/RadioButton", "dijit/form/DateTextBox", "dojo/store/Memory", "dojo/data/ObjectStore",
    "dijit/form/FilteringSelect", "dijit/form/ComboBox", "modulos/funciones/funciones", "modulos/grid/grid", "dijit/focus", "modulos/tabs/tabs",
    "dojo/NodeList-data" ], function (dojo, router, registry, Button, TextBox, ValidationTextBox, SimpleTextarea, Select, CheckBox, RadioButton, DateTextBox, Memory, ObjectStore, FilteringSelect, ComboBox, funciones, grid, focus, Tabs) {

    function defineField(field, place, _fromplace, form) {
        if (field.name)
            field.id = _fromplace + '__' + field.name;
        if (registry.byId(field.id)) {
            registry.byId(field.id).destroy();
        }
        if (field.type)
            field.tipo = field.type;
        switch ((field.type).toLowerCase()) {
            case "boton":
            case "submit":
            case "button":
                field.label = field.value;
                new Button(field).placeAt(place);
                break;
            case "fecha":
            case "date":
            case "timestamp":
            case "time":
                if (field.type == "date" || field.type == "fecha")
                    field.constraints = {
                        selector: 'date',
                        datePattern: field.pattern || 'dd/MM/yyyy'
                    };
                if (field.type == "time" || field.type == "timestamp")
                    field.constraints = {
                        selector: 'date time',
                        datePattern: field.pattern || 'dd/MM/yyyy hh:mm:ss',
                        timePattern: 'HH:mm:ss'
                    };
                if (field.now && !field.value)
                    field.value = new Date();
                if (!field.value)
                    field.value = null;
                delete field.type;
                new DateTextBox(field).placeAt(place);
                break;
            case "password":
            case "hidden":
            case "text":
            case "texto":
                if (field.validate) {
                    delete field.validate;
                    new ValidationTextBox(field).placeAt(place);
                } else
                    new TextBox(field).placeAt(place);
                break;
            case "checkbox":
                delete field.type;
                new CheckBox(field).placeAt(place);
                break;
            case "radio":
                delete field.type;
                new RadioButton(field).placeAt(place);
                break;
            case "textarea":
                delete field.type;
                new SimpleTextarea(field).placeAt(place);
                break;
            case "select":
                delete field.type;
                if (field.store) {
                    setDataStore(field.store, field.data || field.options);
                    delete field.store
                }
                if (field.restore)
                    field.data = getDataStore(field.restore);
                if (field.data || field.options)
                    field.options = field.data || field.options
                delete field.data;
                new Select(field).placeAt(place);
                break;
            case "filter":
                delete field.type;
                if (field.store) {
                    setDataStore(field.store, field.data || field.options);
                    delete field.store
                }
                if (field.restore)
                    field.data = getDataStore(field.restore);
                field.store = new Memory({
                    data: field.data || field.options || getDataStore(field.restore)
                })
                field.searchAttr = "name";
                new FilteringSelect(field).placeAt(place);
                break;
            case "combo":
            case "combobox":
                delete field.type;
                if (field.store) {
                    setDataStore(field.store, field.data || field.options);
                    delete field.store
                }
                field.store = new Memory({
                    data: field.data || field.options || getDataStore(field.restore)
                });
                field.intermediateChanges = false;
                field.enter_ = false;
                if (field.filtro) {
                    field.onKeyPress = funciones.buscar;
                }
                field.searchAttr = "name";
                new ComboBox(field).placeAt(place);
                break;
            case "datalist":
            case "list":
                delete field.type;
                field.onKeyPress = funciones.buscar;
                field.store = new Memory({
                    data: field.data || field.options || getDataStore(field.restore)
                })
                field.enter_ = true;
                field.searchAttr = "name";
                new FilteringSelect(field).placeAt(place);
                break;

            case "tabla":
            case "table":
                delete field.type;
                tabla(field, place);
                break;
            case "detalle":
                delete field.type;
                detalle(field, place, _fromplace);
                break;
            case "rows":
            case "filas":
                delete field.type;
                rows(field, place, _fromplace, form);
                break;
            case "label":
            case "etiqueta":
                delete field.type;
                field.innerHTML = field.innerHTML || field.label || '';
                dojo.create("div", field, place);
                break;
            case "tabs":
            case "tab":
                _createTabs(field, place, _fromplace);
                break;
        }
    }

    function _createTabla(data, place, form) {
        var tabla = null;
        if (form) {
            tabla = dojo.query(dojo.create("table", data))[0];
            registry.byId(place).domNode.appendChild(tabla);
        } else {
            tabla = dojo.create('table', data, place)
        }
        tabla.appendChild(dojo.create("tbody"));
        return tabla;
    }

    tabla = function (field, place) {
        if (!dojo.byId(field.name)) {
            var tabla = dojo.create('table', {
                name: field.name,
                id: field.id,
                class: field.class || ''
            }, place), cols = field.cols, c = 0;

            if (field.head) {
                tabla.createTHead();
                var thead = tabla.tHead;
                field.head.forEach(function (head) {
                    var th = dojo.create("th", head);
                    label = dojo.create("div", {
                        class: 'table_head_title',
                        innerHTML: head.label || ''
                    }, th);
                    thead.appendChild(th);
                });
            }

            if (field.body) {
                // tabla.createTBody();
                tabla.appendChild(dojo.create("tbody"));
                var tbody = tabla.tBodies[0];
                var _row = null;
                field.orden.forEach(function (item) {
                    if (c == 0) {
                        _row = dojo.query(tbody.insertRow(tbody.rows.length))[0];
                    }
                    var _td = dojo.query(_row.appendChild(dojo.create('td', item)))[0];
                    defineField(field.body[item], _td);
                    c++;

                    if (c == cols) {
                        tbody.appendChild(_row);
                        c = 0;
                    }
                });
            }

            if (field.foot) {
                tabla.createTFoot();
                var tfoot = tabla.tFoot;
                field.foot.forEach(function (foot) {
                    var th = dojo.create("th", foot);
                    dojo.create("div", {
                        class: 'table_head_title',
                        innerHTML: foot.label
                    }, th);
                    tfoot.appendChild(th);
                });
            }
        }
    }
    rows = function (field, place, _fromplace, form) {
        if (field.name) {
            if (!dojo.byId(field.name)) {
                var tabla = _createTabla({
                    name: field.name,
                    id: 'tabla_' + field.id,
                    class: field.class || ''
                }, place, form);

                if (field.head) {
                    tabla.createTHead();
                    var thead = tabla.tHead;
                    field.head.forEach(function (head) {
                        var th = dojo.create("th", head);
                        label = dojo.create("div", {
                            class: 'table_head_title',
                            innerHTML: head.label || ''
                        }, th);
                        thead.appendChild(th);
                    });
                }

                if (field.body) {
                    // tabla.createTBody();
                    tabla.appendChild(dojo.create("tbody"));
                    var tbody = tabla.tBodies[0];
                    var _row = null;
                    field.body.forEach(function (_tds) {
                        _row = dojo.query(tbody.insertRow(tbody.rows.length))[0];
                        _tds.forEach(function (item) {
                            var _td = dojo.query(_row.appendChild(dojo.create('td', {
                                colspan: item.colspan || 1,
                                class: item.class || ''
                            })))[0];
                            defineField(item, _td, _fromplace);
                            _addEvento(item, null, null, null, null, _fromplace);
                        });
                        tbody.appendChild(_row);
                    });
                }

                if (field.foot) {
                    tabla.createTFoot();
                    var tfoot = tabla.tFoot;
                    field.foot.forEach(function (foot) {
                        var th = dojo.create("th", foot);
                        dojo.create("div", {
                            class: 'table_head_title',
                            innerHTML: foot.label
                        }, th);
                        tfoot.appendChild(th);
                    });
                }
            }
        } else {
            dojo.create('div', {
                innerHTML: field.msg || field.alert || field.text
            }, place);
        }
    }
    _removeBody = function (tabla) {

        var tbody = tabla.tBodies[0];
        // tbody.remove();
        tabla.removeChild(tbody);

        // tabla.createTBody();
        tabla.appendChild(dojo.create("tbody"));
        tbody = tabla.tBodies[0];
        return tbody;
    }
    addTableRows = function (data) {
        if (data.rows.name) {
            var tabla = dojo.byId('tabla_' + data.rows.name);
            if (tabla) {
                var tbody = _removeBody(tabla), rows = data.rows.fields || data.rows.rows;
                if (rows) {
                    var _row = null;
                    rows.forEach(function (_tds) {
                        _row = dojo.query(tbody.insertRow(tbody.rows.length))[0];
                        _tds.forEach(function (item) {
                            var _td = dojo.query(_row.appendChild(dojo.create('td', {
                                colspan: item.colspan || 1,
                                class: item.class || ''
                            })))[0];
                            defEventField(item, _td);
                        });
                        tbody.appendChild(_row);
                    });

                }
            }
        }
    }
    setDataStore = function (name, data) {
        dojo.query(dojo.body()).data(name, data);
        return true;
    }
    getDataStore = function (name) {
        return dojo.query(dojo.body()).data(name)[0] || null;
    }
    defEventField = function (item, place) {
        defineField(item, place);
        _addEvento(item);
    }
    _addEvento = function (field, name, callback, orden, evento, place) {
        name = place + "__" + (name || field.name);
        if (field.usrevento) {
            if (field.usrevento == true) {
                if (evento) {
                    dojo.setProp(name, field);
                    dojo.setAttr(name, field);
                    dojo.connect(dojo.byId(name), "click", function (e) {
                        evento(this, orden, callback);
                    });
                }
            }
        }

        if (field.change || field.onchange) {
            if (registry.byId(name)) {
                registry.byId(name).on("change", function () {
                    var data = field.change || field.onchange, url = data.url;
                    data.contenedor = place;
                    data.doc_v_id = _getDocVersionId(place);

                    if (data.name)
                        data[data.name] = _getValue(this);
                    else
                        data.valor = _getValue(this);
                    if (registry.byId(name).get('dataServer') != data.valor)
                        funciones.onchange(url, data, callback);
                    if (data.elementoconfoco)
                        dojo.query(dojo.body()).data("elementoconfoco", place + "__" + data.elementoconfoco);
                    else
                        dojo.query(dojo.body()).data("elementoconfoco", name);
                });
            }
        }

        if (field.onchange2) {
            if (registry.byId(name)) {
                registry.byId(name).on("change", function () {
                    var data = field.onchange2, url = data.url;
                    data.contenedor = place;
                    data.doc_v_id = _getDocVersionId(place);
                    if (data.hasOwnProperty("formdata")) {
                        if ((data.formdata.name || data.formdata.nombre || data.formdata.form).indexOf('__') == -1)
                            data.formdata.form = place + '__' + (data.formdata.name || data.formdata.nombre || data.formdata.form);
                    }

                    data.valor = _getValue(this);
                    funciones.onchange2(url, data, callback);
                });
            }
        }

        if (field.save || field.guardar) {
            if (registry.byId(name)) {
                registry.byId(name).on("click", function () {
                    var data = field.save || field.guardar;
                    data.contenedor = place;
                    data.variables = orden;
                    data.doc_v_id = _getDocVersionId(place);
                    if (data.form) {
                        if ((data.form).indexOf('__') == -1)
                            data.form = place + '__' + data.form;
                    }
                    funciones.save(data, callback);
                });
            }
        }

        if (field.list || field.lista) {
            if (registry.byId(name)) {
                registry.byId(name).on("click", function () {
                    var data = field.list || field.lista;
                    data.contenedor = place;
                    data.doc_v_id = _getDocVersionId(place);
                    if (data.form) {
                        if ((data.form).indexOf('__') == -1)
                            data.form = place + '__' + data.form;
                    }
                    funciones.lista2(data, callback);
                });
            }
        }

        if (field.send || field.enviar) {
            if (registry.byId(name)) {
                registry.byId(name).on("click", function () {
                    var data = field.send || field.enviar;
                    data.contenedor = place;
                    data.variables = orden;
                    data.doc_v_id = _getDocVersionId(place);
                    if (data.form) {
                        if ((data.form).indexOf('__') == -1)
                            data.form = place + '__' + data.form;
                    }
                    funciones.form(data, callback);
                });
            }
        }

        if (field.link) {
            if (registry.byId(name)) {
                registry.byId(name).on("click", function () {
                    var data = field.link, url = data.url;
                    data.contenedor = place;
                    data.doc_v_id = _getDocVersionId(place);
                    funciones.onlink(url, data, callback);
                });
            }
        }

        if (field.golink) {
            if (registry.byId(name)) {
                registry.byId(name).on("click", function () {
                    var data = field.golink;
                    router.go(data.ruta || data.rute);
                });
            }
        }

        if (field.changeTo || field.changeto) {
            if (registry.byId(name)) {
                registry.byId(name).on("keydown", function (e) {
                    switch (e.keyCode) {
                        case dojo.keys.ENTER:
                            focus.curNode && focus.curNode.blur();
                            focus.focus(dojo.byId(field.changeTo || field.changeto));
                            dojo.query(dojo.body()).data("elementoconfoco", (field.changeTo || field.changeto));
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        if (field.enterpress || field.press) {
            if (registry.byId(name)) {
                registry.byId(name).on("keydown", function (e) {
                    console.log(registry.byId(name));
                    console.log(e);
                    switch (e.keyCode) {
                        case dojo.keys.TAB:
                        case dojo.keys.ENTER:
                            var data = field.enterpress || field.press, url = data.url;
                            data.contenedor = place;
                            data.doc_v_id = _getDocVersionId(place);

                            if (data.name)
                                data[data.name] = _getValue(this);
                            else
                                data.valor = _getValue(this);
                            if (!funciones.ajax.isEmpty(data.valor))
                                funciones.onchange(url, data, callback);
                            if (data.elementoconfoco)
                                dojo.query(dojo.body()).data("elementoconfoco", place + "__" + data.elementoconfoco);
                            else
                                dojo.query(dojo.body()).data("elementoconfoco", name);
                            break;
                        default:
                            break;
                    }
                });
            }
        }
    }
    _getDocVersionId = function (place) {
        doc_v_id = 0;
        if (registry.byId(place + '__doc_v_id'))
            doc_v_id = registry.byId(place + '__doc_v_id').get('value');
        return doc_v_id;
    }
    createFields = function (name, field, fieldset, callback, orden, evento, place, form) {
        if (typeof (fieldset) == "string")
            createFieldDiv(name, field, fieldset, callback, orden, evento, place)
        else
            createFieldRow(name, field, fieldset, callback, orden, evento, place, form)
    }
    createFieldDiv = function (name, field, fieldset, callback, orden, evento, place) {
        field.name = name;
        var label = null, _class = "field-row";
        if (field.label && field.type != "label") {
            label = '<label for="' + name + '">' + field.label + '</label>';
            delete field.label;
        }

        if (field.type == "hidden")
            _class = "none_"
        dojo.create("div", {
            id: '_' + name + '_',
            class: _class,
            innerHTML: label || ''
        }, fieldset);
        defineField(field, dojo.byId('_' + name + '_'), place);

        _addEvento(field, name, callback, orden, evento, place);
    }
    createFieldRow = function (name, field, tabla, callback, orden, evento, place, form) {
        field.name = name;
        var tbody = tabla.tBodies[0], row = null, _field = null, label = null
        if (field.label && field.type != "label") {
            label = dojo.query(dojo.create('td', {
                innerHTML: '<div class="field-label">' + field.label + '</div>'
            }))[0]
            delete field.label;
        }
        row = dojo.query(tbody.insertRow(tbody.rows.length))[0];

        if (label) {
            row.appendChild(label);
            _field = dojo.query(row.appendChild(dojo.create('td', field.td || {})))[0];
        } else {
            _field = dojo.query(row.appendChild(dojo.create('td', dojo.mixin({
                colspan: 2
            }, field.td || {}))))[0];
        }

        row.appendChild(_field);
        defineField(field, _field, place);
        _addEvento(field, name, callback, orden, evento, place);

    }
    createRow = function (row, tabla, callback, orden, evento, place) {
        if (row.orden) {
            var tbody = tabla.tBodies[0], _row = dojo.query(tbody.insertRow(tbody.rows.length))[0];
            row.orden.forEach(function (field_) {
                var field = row[field_], _field = null, label = null;

                switch ((field.type).toLowerCase()) {
                    case "boton":
                    case "submit":
                    case "button":
                    case "hidden":
                        _field = dojo.query(_row.appendChild(dojo.create('td', dojo.mixin({
                            colspan: field.colspan || 1
                        }, field.td || {}))))[0];
                        _row.appendChild(_field);
                        defineField(field, _field, place);
                        _addEvento(field, name, callback, orden, evento, place);
                        break;
                    case "fecha":
                    case "date":
                    case "timestamp":
                    case "time":
                    case "password":
                    case "text":
                    case "texto":
                    case "checkbox":
                    case "radio":
                    case "textarea":
                    case "select":
                    case "filter":
                    case "combo":
                    case "combobox":
                    case "datalist":
                    case "list":
                        label = dojo.query(dojo.create('td', {
                            colspan: 1,
                            innerHTML: '<div class="field-label">' + field.label + '</div>'
                        }))[0];
                        _row.appendChild(label);
                        _field = dojo.query(_row.appendChild(dojo.create('td', dojo.mixin({
                            colspan: field.colspan || 1
                        }, field.td || {}))))[0];

                        _row.appendChild(_field);
                        defineField(field, _field, place);
                        _addEvento(field, name, callback, orden, evento, place);
                        break;
                    case "tabs":
                    case "tab":
                        _field = dojo.query(_row.appendChild(dojo.create('td', dojo.mixin({
                            colspan: field.colspan || 1
                        }, field.td || {}))))[0];
                        _row.appendChild(_field);
                        _createTabs(field, _field);
                        break;
                    case "tabla":
                    case "table":
                    case "rows":
                    case "filas":
                    case "label":
                    case "etiqueta":
                        _field = dojo.query(_row.appendChild(dojo.create('td', dojo.mixin({
                            colspan: field.colspan || 1
                        }, field.td || {}))))[0];
                        _row.appendChild(_field);
                        defineField(field, _field, place);
                        break;
                    case "espacio":
                    case "spacer":
                        delete field.type;
                        _field = dojo.query(_row.appendChild(dojo.create('td', field)))[0];
                        _row.appendChild(_field);
                        break;
                }
            });
        }
    }
    _createTabs = function (data, place, _fromplace) {
        if (data.orden) {
            if (data.tabs) {
                var tab = Tabs.nestedTab(place, _fromplace);
                data.orden.forEach(function (tab_) {
                    var content = data.tabs[tab_], cp = Tabs.contentAcc(tab, content.optstab, _fromplace);
                    if (content.data) {
                        var div = dojo.query(registry.byId(cp.get('id')).containerNode.appendChild(dojo.create("div", {
                            class: 'tab-content'
                        })))[0];
                        defineField(content, div, _fromplace);
                    }
                });
                tab.selectChild((tab.getChildren())[0]);
                tab.startup();
            }
        }

    }
    field = function (field, _id) {
        field.name = field.name + '_' + (_id || field._id || new Date().getTime());
        field.id = field.name;
        if (registry.byId(field.id)) {
            registry.byId(field.id).destroy();
        }
        var _field = null;
        switch ((field.type).toLowerCase()) {
            case "submit":
            case "button":
                field.label = field.value;
                _field = new Button(field);
                break;
            case "date":
                delete field.type;
                field.constraints = {
                    selector: 'date',
                    datePattern: 'dd/MM/yyyy'
                };
                if (field.now)
                    field.value = new Date();
                _field = new DateTextBox(field);
                break;
            case "password":
            case "hidden":
            case "text":
                field.containerNode = "<input/>"
                if (field.validate) {
                    delete field.validate;
                    _field = new ValidationTextBox(field);
                } else
                    _field = new TextBox(field);
                break;
            case "checkbox":
                delete field.type;
                _field = new CheckBox(field);
                break;
            case "radio":
                delete field.type;
                _field = new RadioButton(field);
                break;
            case "textarea":
                delete field.type;
                _field = new SimpleTextarea(field);
                break;
            case "select":
                field.tipo = field.type;
                delete field.type;
                _field = new Select(field);
                break;
            case "filter":
                field.tipo = field.type;
                delete field.type;
                field.store = new Memory({
                    data: field.data || dojo.body().data(field.store)
                })
                field.searchAttr = "name";
                _field = new FilteringSelect(field);
                break;
            case "combo":
                field.tipo = field.type;
                delete field.type;
                field.store = new Memory({
                    data: field.data || dojo.body().data(field.store)
                })
                field.searchAttr = "name";
                _field = new ComboBox(field);
                break;
            case "datalist":
                field.tipo = field.type;
                delete field.type;
                field.onKeyPress = funciones.buscar;
                field.store = new Memory({
                    data: field.data || dojo.body().data(field.store)
                })
                field.searchAttr = "name";
                _field = new FilteringSelect(field);
                break;
        }
        return _field;
    }
    lista = function (id, data, place) {
        grid.list(id, data, Button, ObjectStore, Memory, router, place);
    }
    detalle = function (_data, place, _place) {
        if (dojo.byId(place)) {
            var opts = dojo.mixin({
                id: null,
                fija: false
            }, _data.opts);
            id = ((opts.id).indexOf('__') == -1) ? _place + '__' + (opts.id || "tabla_" + new Date().getTime()) : (opts.id || "tabla_" + new Date().getTime()),
                alto = opts.alto, fija = opts.fija, data = _data.data;

            if (!dojo.byId(id)) {
                dojo.destroy(dojo.byId(id));
                var anchos = {},

                // header
                    rowTable = dojo.create('table', {
                        class: "dojoxGridRowTable",
                        style: "",
                        border: 0,
                        cellspacing: 0,
                        cellpadding: 0
                    }, place);

                var headerBody = rowTable.appendChild(dojo.create("tbody")), thead = rowTable.insertRow(0);

                data.header.forEach(function (head) {
                    var toolid = head.tooltip ? "thead_" + new Date().getTime() : '', columnheader = dojo.create('th', {
                        id: toolid,
                        class: 'dojoxGridCell dojoDndItem ',
                        style: "width:" + head.ancho + "em;"
                    }, thead);
                    dojo.create('div', {
                        style: "padding: 3px;",
                        class: 'tablaCeldaLabel',
                        innerHTML: '<b>' + head.html + '</b>'
                    }, columnheader);
                    anchos[head.id] = head.ancho;
                    if (head.tooltip) {
                        new dojo.dijit.Tooltip({
                            connectId: toolid,
                            label: head.tooltip,
                            position: [ 'above', 'below' ]
                        });
                    }
                });

                var anchotabla = parseInt(rowTable.offsetWidth);
                var viewsHeaderNode = dojo.create('div', {
                    class: "dojoxGridMasterHeader",
                    style: "display: block; height: 23px;"
                }), headerContentNode = dojo.create('div', {
                    style: "width:9000em;"
                });

                dojo.place(rowTable, headerContentNode);

                var master = dojo.create('div', {
                    id: id,
                    class: "dojoxGrid",
                    style: "margin: 10px auto 0px; height: auto; width: " + (anchotabla + 1) + "px;"
                }, place), headerNode = dojo.create('div', {
                    class: "dojoxGridHeader",
                    style: "width: " + anchotabla + "px; left: 1px; top: 0px;"
                }, viewsHeaderNode);

                dojo.place(viewsHeaderNode, master);
                dojo.place(headerContentNode, headerNode);

                anchotabla = parseInt(rowTable.offsetWidth);
                dojo.setStyle(headerNode, {
                    "width": anchotabla + "px"
                });
                dojo.setStyle(master, {
                    "width": (anchotabla + 1) + "px"
                });

                // body

                var bodyContent = dojo.create('div', {
                    // class : "bodyContenedor",
                    style: "position: absolute; left: 0px; top: 0px;"
                }, place);
                data.body.forEach(function (item) {
                    rowContent = dojo.create('div', {
                        id: (_place + '__row_' + item.detalleid) || '',
                        class: "dojoxGridRow"
                    }, bodyContent), rowtable = dojo.create('table', {
                        class: "dojoxGridRowTable",
                        border: 0,
                        cellspacing: 0,
                        cellpadding: 0
                    }, rowContent), rowtableBody = rowtable.appendChild(dojo.create("tbody")), rowTableRow = rowtableBody.insertRow(0);
                    for (var ancho in anchos) {
                        var td = dojo.create('td', {
                            class: 'dojoxGridCell',
                            style: "width:" + anchos[ancho] + "em;"
                        }, rowTableRow);
                        div = dojo.query(dojo.create('div', {
                            style: "padding: 3px;",
                            class: 'tablaCeldaLabel'
                        }, td))[0];
                        if (item[ancho]) {
                            defineField(item[ancho], div, _place);
                            _addEvento(item[ancho], null, null, null, null, _place);
                        }
                    }
                });
                var altobody = alto || parseInt(bodyContent.offsetHeight), fija = alto ? !(alto > parseInt(bodyContent.offsetHeight)) : false;
                var viewsNode = dojo.create('div', {
                    class: "dojoxGridMasterView",
                    style: "height: " + altobody + "px;"
                }, master), body = dojo.create('div', {
                    class: "dojoxGridView",
                    style: "width: " + anchotabla + "px; left: 1px; top: 0px;"
                }, viewsNode), scrollboxNode = dojo.create('div', {
                    class: "dojoxGridScrollbox"
                }, body), contentNode = dojo.create('div', {
                    class: "dojoxGridContent",
                    style: "height: " + altobody + "px; width: " + anchotabla + "px;" + (fija ? "overflow-y: scroll;" : "")
                }, scrollboxNode);

                dojo.place(bodyContent, contentNode);
                altobody = alto || parseInt(bodyContent.offsetHeight)
                dojo.setStyle(viewsNode, {
                    "height": altobody + "px"
                });
                dojo.setStyle(contentNode, {
                    "height": altobody + "px"
                });

                // footer
                var rowTableFooter = dojo.create('table', {
                    class: "dojoxGridRowTable",
                    style: "",
                    border: 0,
                    cellspacing: 0,
                    cellpadding: 0
                }, place), footerBody = rowTableFooter.appendChild(dojo.create("tbody")), tfoot = footerBody.insertRow(0);

                data.footer.forEach(function (foot) {
                    for (var ancho in anchos) {
                        var columnheader = dojo.create('th', {
                            class: 'dojoxGridCell dojoDndItem ',
                            style: "width:" + anchos[ancho] + "em;"
                        }, tfoot);
                        div = dojo.query(dojo.create('div', {
                            style: "padding: 3px;",
                            class: 'tablaCeldaLabel'
                        }, columnheader))[0];
                        if (foot[ancho]) {
                            defineField(foot[ancho], div, _place);
                            _addEvento(foot[ancho], null, null, null, null, _place);
                        }
                    }
                });
                var viewsFooterNode = dojo.create('div', {
                    class: "dojoxGridMasterHeader",
                    style: "display: block; height: 35px;"
                }, master), FooterNode = dojo.create('div', {
                    class: "dojoxGridHeader",
                    style: "width: " + anchotabla + "px; left: 1px; top: 0px;"
                }, viewsFooterNode), footerContentNode = dojo.create('div', {
                    style: "width:9000em;"
                }, FooterNode);

                dojo.place(rowTableFooter, footerContentNode);

            }
        }
    }
    addDetalleRow = function (data) {
    }
    addDetalleRows = function (data) {
        if (data.row)
            addDetalleRow(data)
        else {
            if (data.name) {
                var tabla = dojo.byId(data.name);
                if (body) {

                    var place = tabla.parentNode, _place = (data.name).indexOf('__') != -1 ? (data.name).split('__')[0] : data.name;
                    tabla.remove();
                    detalle(data, place, _place);
                }
            }
        }
    }
    function _getValue(widget) {
        switch ((widget.params.tipo).toLowerCase()) {
            case "fecha":
            case "date":
            case "timestamp":
            case "time":
                return widget.displayedValue
            case "checkbox":
            case "radio":
                return widget.get('checked') ? 1 : 0
            case "password":
            case "hidden":
            case "text":
            case "texto":
            case "textarea":
            case "select":
            case "filter":
            case "combo":
            case "combobox":
            case "datalist":
            case "list":
            default:
                return widget.get("value");
        }
    }

    return {
        createField: createFields,
        field: field,
        list: lista,
        tabla: tabla,
        rows: rows,
        addTableRows: addTableRows,
        addDetalleRow: addDetalleRow,
        addDetalleRows: addDetalleRows,
        createRow: createRow
    };

});
