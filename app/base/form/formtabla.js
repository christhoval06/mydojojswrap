define([
    "dojo",
    "dijit/registry",
    "dijit/form/Form",
    "modulos/form/field",
    "modulos/funciones/funciones",
    "dojo/NodeList-data"
],
    function (dojo, registry, Form, Field, funciones) {
        function _createForm(form, place) {

            if (dojo.byId(place + "__" + "_app_form_")) dojo.destroy(dojo.byId(place + "__" + "_app_form_"));
            form.id = form.name;
            form.action = form.action || "";
            form.method = form.method || "";
            if (registry.byId(form.id)) {
                registry.byId(form.id).destroy();
            }

            dojo.create("div", {id: place + "__" + "_app_form_", class: '_form_'}, place);
            new Form(form, dojo.create("form")).placeAt(place + "__" + '_app_form_');
            dojo.create("div", {id: "detalle_" + form.id, class: "fieldset"}, place)

            registry.byId(form.id).startup();
            return form.id
        }


        function _createFieldSet(form) {
            var tabla = dojo.query(dojo.create("table", {class: "tabla"}))[0]
            registry.byId(form).domNode.appendChild(tabla);
            //tabla.createTBody();
            tabla.appendChild(dojo.create("tbody"));
            return tabla;
        }

        function _createFields(name, field, tabla, callback, orden, evento, place, form) {
            Field.createField(name, field, tabla, callback, orden, evento, place, form)
        }

        /**
         *
         * @param data : contiene el json que arma el formulario
         * @param callback : funcion que se ejecutara despues de precionar un boton de guardar
         * @param place : lugar donde colocare el formulario
         * @param evento: funcion adjuntada a un control del formulario
         */

        form = function (data, callback, place, evento) {
            if (data.success) {
                //dojo.empty(place);
                if (data.form) {
                    var form = _createForm(data.form, place || dojo.body()),
                        otrosValores = data.otros ? data.otros.formvalues ? data.otros.formvalues : [] : [];
                    if (data.fields) {
                        var tabla = _createFieldSet(form);
                        data.orden.forEach(function (field) {

                            if (data.fields[field]) {
                                switch (field.toLowerCase()) {
                                    default:
                                        _createFields(field, data.fields[field], tabla, callback, data.orden.concat(otrosValores), evento, place, form);
                                }
                            }
                        });

                    }

                }
            }
        }


        return {
            form: form,
        };

    });