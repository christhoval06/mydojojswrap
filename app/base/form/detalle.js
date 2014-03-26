/**
 * @author Cristobal Barba
 */


define([
    "dojo",
    "dijit/registry",
    "dijit/layout/TabContainer",
    "dojox/layout/ContentPane",
    "dojox/layout/TableContainer",
    "modulos/form/field"
],
    function (dojo, registry, TabContainer, ContentPane, TableContainer, Fields) {

        function detalleTabs(data, fieldset) {
            if (data.tabs) {
                if (registry.byId('detalle_' + data.id + '_tabs')) {
                    registry.byId('detalle_' + data.id + '_tabs').destroy();
                }
                ;
                var tabs = new TabContainer({id: 'detalle_' + data.id + '_tabs', style: "height: 100%; width: 100%;"}, dojo.create('div', {}, fieldset));
                dojo.forEach(data.tabs, function (item) {
                    var cp = new ContentPane({title: (item.title).toUpperCase(), content: 'este es un detalle'});
                    tabs.addChild(cp);
                });
                tabs.startup();
            }
        }

        function detalleTabla(data, fieldset) {
            console.log(data);
            console.log(Fields);
            if (data.fields) {
                if (registry.byId('detalle_' + data.id + '_tabla')) {
                    registry.byId('detalle_' + data.id + '_tabla').destroy();
                }
                ;
                var conf = {id: 'detalle_' + data.id + '_tabla', style: "height: 100%; width: 100%;"};
                conf.cols = data.cols;
                conf.showLabels = false;
                var tabla = new TableContainer(conf, dojo.create('div', {}, fieldset));
                //tabla.placeAt(fieldset);

                dojo.forEach(data.fields, function (row) {
                    data.orden.forEach(function (field) {

                        var item = row.fields[field],
                            _field = Fields.field(item, row._id);

                        tabla.addChild(_field);
                    });
                });

                tabla.startup();

                tabla.table.createTHead();

                data.labels.forEach(function (label) {
                    var head = tabla.table.tHead,
                        th = dojo.create("th", {class: 'detalle_table_col_title'}),
                        label = dojo.create("div", {class: 'table_head_title', innerHTML: label}, th);
                    head.appendChild(th);
                });
            }
        }

        insertRow = function (_id, data) {
            var t = registry.byId('detalle_' + _id + '_tabla');
            if (t) {
                var tabla = t.table;
                if (tabla) {
                    var body = tabla.tBodies[0],
                        len = body.rows.length;

                    if (data.fields) {
                        dojo.forEach(data.fields, function (row) {
                            var _row = dojo.query(body.insertRow(len))[0];
                            data.orden.forEach(function (field) {
                                var _td = dojo.query(_row.appendChild(dojo.create('td', {class: 'tableContainer-valueCell'})))[0],
                                    item = row.fields[field],
                                    _field = Fields.field(item, row._id);

                                _td.appendChild(_field.domNode)
                            });
                        });
                    }
                }
            }
        }

        function create(data, place) {
            switch (data.tipo.toLowerCase()) {
                case "table".toLowerCase():
                case "tabla".toLowerCase():
                    detalleTabla(data, place);
                    break;
                case "t".toLowerCase():
                case "tb".toLowerCase():
                case "tab".toLowerCase():
                case "tabs".toLowerCase():
                    detalleTabs(data, place);
                    break;
                /*default:*/
            }
        }

        return {
            create: create,
            row: insertRow
        };

    });
