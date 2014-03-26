define(["dojo", "dijit/registry", "dijit/Dialog", "dijit/form/Form", "modulos/form/field", "modulos/funciones/funciones", "dojo/NodeList-data"], function (dojo, registry, Dialog, Form, Field, funciones) {
    function createDialog(opts, place) {
        return new Dialog(opts).placeAt(place || dojo.body());
    }

    function _createForm(form, place) {
        form.id = form.name;
        if (registry.byId(form.id)) {
            registry.byId(form.id).destroy();
        }
        var _form = new Form(form, dojo.create("form")).placeAt(place);
        dojo.create("div", {
            id: "detalle_" + form.id,
            class: "fieldset"
        }, place)

        _form.startup();
        return _form.get('id');
    }

    function _createFieldSet(form) {
        var tabla = dojo.query(dojo.create("table", {class: "tabla"}))[0]
        registry.byId(form).domNode.appendChild(tabla);
        tabla.appendChild(dojo.create("tbody"));
        return tabla;
    }

    function _createFields(name, field, tabla, callback, orden, evento, place) {
        Field.createField(name, field, tabla, callback, orden, evento, place)
    }

    form = function (data, place) {
        if (data.success) {
            var dlg = createDialog(data.opts, pace);
            if (data.form)
                var form = _createForm(data.form, dlg.containerNode);
            if (data.fields) {
                data.fields.orden.forEach(function (tabla) {
                    var _tablaContenedor = _createFieldSet(form);
                    t = data.fields[tabla];
                    (t.orden).forEach(function (field) {
                        if (t[field])
                            _createFields(field, t[field], _tablaContenedor, callback, data.orden.concat(otrosValores), evento, place);
                    });
                });
            }
        }

    }

    return {
        form: form,
    };

});
