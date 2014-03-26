define(
    [ "dojo", "dijit/registry", "dijit/form/Form", "modulos/form/field",
        "modulos/grid/grid", "modulos/funciones/funciones",
        "modulos/form/detalle", "modulos/ajax/loader",
        "modulos/form/formtabla", "modulos/form/formcustom",
        "modulos/form/formmultitabla", "modulos/menulateral",
        "dojo/NodeList-data" ],
    function (dojo, registry, Form, Field, grid, funciones, detalle, loader, formtabla, formcustom, formmultitabla, menulateral) {

        function createForm(form, place) {
            loader.create('bar');
            if (dojo.byId(place + "__" + "_app_form_"))
                dojo.destroy(dojo.byId(place + "__" + "_app_form_"));
            form.id = form.name;
            form.action = form.action || "";
            form.method = form.method || "";
            if (registry.byId(form.id)) {
                registry.byId(form.id).destroy();
            }
            dojo.create("div", {
                id: place + "__" + "_app_form_",
                class: '_form_'
            }, place);
            new Form(form, dojo.create("form")).placeAt(place + "__"
                + '_app_form_');
            dojo.create("div", {
                id: "detalle_" + form.id,
                class: "fieldset"
            }, place)
            registry.byId(form.name).startup();
            return form.name
        }

        function createFieldSet(form) {
            registry.byId(form).domNode.appendChild(dojo.create("div", {
                id: "fieldset_" + form,
                class: "fieldset"
            }));
            return "fieldset_" + form;
        }

        function createFields(name, field, fieldset, callback, orden, evento, place) {
            Field.createField(name, field, fieldset, callback, orden,
                evento, place)
        }

        function createDetail(data, fieldset) {
            var _class = "field-detalle-row";
            dojo.create("div", {
                id: _class + "_detalle_" + data.id,
                class: _class
            }, fieldset);
            detalle.create(data, _class + "_detalle_" + data.id);
        }

        function _createTitle(titulo, place) {
            var div = dojo.create('div', {
                class: "_title_"
            }, place);
            dojo.create('h1', {
                innerHTML: titulo
            }, div);

            dojo.doc.title = titulo;
        }

        function createMenulateral(menu, place) {
            dojo.create('div', {
                id: place + "__my_menuAUX__",
                class: "_menuaux_",
                style: "width: 50em;"
            }, place);
            if (dojo.byId(place + "__my_menuAUX__"))
                menulateral.create(menu, place + "__my_menuAUX__");
        }

        listgrid = function (id, data, place) {
            Field.list(id, data, place);
        }
        error = function (data) {
            funciones.dialogos.alert("<b>Error</b>", data.text || data.msg
                || data.error);
        }
        form = function (data, callback, place, evento, tipo) {
            if (data.success) {
                if (data.menulateral)
                    createMenulateral(data.menulateral, place)

                if (data.title)
                    _createTitle(data.title, place);

                if (data.form) {
                    if ((data.form.name).indexOf('__') == -1)
                        data.form.name = place + '__' + data.form.name;
                    switch ((data.fields.type || data.fields.tipo || 'otro')
                        .toLowerCase()) {
                        case "design":
                            formcustom.form(data, callback, place, evento)
                            break;
                        case "tablas":
                            formmultitabla.form(data, callback, place, evento)
                            break;
                        default:
                            if (tipo == "tabla" || tipo == "t")
                                formtabla.form(data, callback, place, evento)
                            else
                                _form(data, callback, place, evento);
                            break;
                    }
                }
            }
        }
        /**
         *
         * @param data : contiene el json que arma el formulario
         * @param callback : funcion que se ejecutara despues de precionar
         *            un boton de guardar
         * @param place : lugar donde colocare el formulario
         * @param evento: funcion adjuntada a un control del formulario
         */

        _form = function (data, callback, place, evento) {

            // dojo.empty(place);
            if (data.form) {
                var form = createForm(data.form, place || dojo.body()), otrosValores = data.otros ? data.otros.formvalues ? data.otros.formvalues
                    : []
                    : [];
                if (data.fields) {
                    var fieldset = createFieldSet(form);
                    data.orden.forEach(function (field) {

                        if (data.fields[field])
                            createFields(field, data.fields[field],
                                fieldset, callback, data.orden
                                    .concat(otrosValores), evento,
                                place);
                    });

                }
                loader.destroy();
            }
            if (data.elementoconfoco) {
                funciones.foco(data.contenedor + "__"
                    + data.elementoconfoco);
            }

        }
        formLista = function (id, data, place, callback) {
            if (data.success) {
                if (data.menulateral)
                    createMenulateral(data.menulateral, place)
                if (data.form)
                    form(data, callback, place, null, 't');
                else
                    listgrid(id, data, place);

                if (data.lista) {
                    if (data.lista.place) {
                        if ((data.lista.place).indexOf('__') == -1)
                            data.lista.place = 'detalle_' + place + '__'
                                + data.lista.place;
                        listgrid(data.lista.id || id, data.lista,
                            data.lista.place);
                    }
                }
            }
        }
        setRuta = function (ruta) {
            ruter = registry.byId("rutas_formulario__ruta_from_ruta");
            if (ruter)
                ruter.set('value', ruta);
        }

        return {
            form: form,
            lista: formLista,
            listgrid: listgrid,
            func: funciones,
            error: error,
            loader: loader,
            download: funciones.download,
            dialogos: funciones.dialogos,
            getFormData: funciones.getFormData,
            ruta: setRuta
        };

    });
