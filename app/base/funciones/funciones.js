define([ "dojo", "modulos/ajax/ajax", "dijit/focus", "dojo/NodeList-data" ], function(dojo, ajax, focus) {

	buscar = function(e) {
		var me = this, val = me.get('displayedValue'), filtro = me.get('filtro'), params = {}, code = e.keyCode;
		if (filtro.data) {
			params = filtro.data;
			params.val = val;
		}
		params.nocache = new Date().getTime()
		if (val === "")
			return;
		if (val.length < 3)
			return;

		if (e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
			return;
		if (code == 13 && me.get('enter_'))
			ajax.get(filtro.url, function(data) {
				if (data.success) {
					me.get('store').setData(data.data || data.options);
				} else {
					me.get('store').setData([ {
						"id" : "0",
						"name" : "No hay resultados"
					} ]);
				}
				me.loadAndOpenDropDown();
				me.toggleDropDown();
			}, params);

		if (!me.get('enter_') && val.length > 3)
			ajax.get(filtro.url, function(data) {
				if (data.success) {
					me.get('store').setData(data.data || data.options);
				} else {
					me.get('store').setData([ {
						"id" : "0",
						"name" : "No hay resultados"
					} ]);
				}
				me.loadAndOpenDropDown();
				me.toggleDropDown();
			}, params);

	}
	_getFormData = function(_data) {
		var dataForm = null, data = {};
		if (_data.form) {
			dataForm = dojo.formToObject(_data.form)
			if (_data.variables) {
				dojo.forEach(_data.variables, function(e, i) {
					data[e] = dataForm[e];
				});

			} else
				data = dataForm;
			data.iev_t = new Date().getTime();
		}
		return dojo.mixin(_data, data);

	}
	_statechangedLista = function(data, callback) {
		if (data.success) {
			callback(data);
		} else {
			ajax.dialog.alert("<b>Error</b>", data.msg || data.text, null);
			console.log(data);
		}
	}
	_statechanged = function(data, callback) {
		if (data.success) {
			if (data.hasOwnProperty('alert') || data.hasOwnProperty('msg') || data.hasOwnProperty('text')) {
				if (typeof (callback) == "object")
					ajax.dialog.options("", data.msg || data.alert || data.text, callback);
				else
					ajax.dialog.alert("", data.msg || data.alert || data.text, callback);
			}
			if (data.hasOwnProperty('rows') || data.hasOwnProperty('bdetalle')) {
				var fields = dojo.require("modulos/form/field");
				if (data.hasOwnProperty('bdetalle'))
					fields.addDetalleRows(data.bdetalle);
				else
					fields.addTableRows(data);
			}
			if (data.hasOwnProperty('contenedor')) {
				for ( var p in data) {
					var control = data.contenedor + '__' + p;
					if (dojo.dijit.registry.byId(control))
						_setValueOrData(dojo.dijit.registry.byId(control), data[p])
					else if (dojo.byId(control))
						dojo.byId(control).innerHTML = data[p];
					else if (dojo.byId(p))
						dojo.byId(p).innerHTML = data[p];
				}
			}

			for ( var p in data) {
				if (dojo.dijit.registry.byId(p)) {
					_setValueOrData(dojo.dijit.registry.byId(p), data[p])
				} else {
					if (dojo.byId(p))
						dojo.byId(p).innerHTML = data[p];
				}
			}
			if (typeof (callback) == "function")
				callback(data);
		} else {
			if (data.hasOwnProperty('alert') || data.hasOwnProperty('msg') || data.hasOwnProperty('text'))
				ajax.dialog.alert("<b>Error</b>", data.msg || data.alert || data.text);
		}
		if (data.hasOwnProperty('elementoconfoco'))
			_setFoco(data.contenedor + '__' + data.elementoconfoco);
		else {
			if (dojo.query(dojo.body()).data()[0].elementoconfoco)
				_setFoco(dojo.query(dojo.body()).data()[0].elementoconfoco);
		}

	},

	_setFoco = function(elemento) {
		focus.curNode && focus.curNode.blur();
		if (dojo.byId(dojo.query(elemento))) {
			focus.focus(dojo.byId(elemento));
			var wiget = dojo.dijit.registry.byId(elemento);
			if (wiget.textbox)
				wiget.textbox.select()
		}
	},

	_setValueOrData = function(wiget, data) {
		if (typeof (data) == "object") {
			if (data.length > 0) {
				switch (wiget.params.tipo) {
				case "select":
					wiget.data = []
					wiget.addOptions(data)
					wiget.setValue(data[0].value)
					break;
				case "filter":
				case "datalist":
				case "list":
				case "combo":
				case "combobox":
					wiget.get('store').setData([]);
					wiget.get('store').setData(data);
					wiget.setValue(data[0].id)
					break;
				}
			}
		} else {
			wiget.set('dataServer', data);
			wiget.set('value', data);
		}
	}
	_onchange = function(url, data, callback) {
		ajax.get(url, _statechanged, _codeData(data), callback, null, false);
	}
	_onchange2 = function(url, _data, callback) {
		var data = _addparams(_addformdata(_data));
		ajax.post(url, _statechanged, _codeData(_data), callback, null, false);
	}
	_addformdata = function(_data) {
		var data = {};
		if (_data.hasOwnProperty("formdata")) {
			if (dojo.dijit.registry.byId(_data.formdata.name || _data.formdata.nombre || _data.formdata.form)) {
				if (_data.formdata) {
					data = _getFormData(dojo.mixin(_data, {
						"form" : (_data.formdata.name || _data.formdata.nombre || _data.formdata.form),
						"variables" : (_data.formdata.fields || _data.formdata.variables || _data.formdata.campos)
					}), true);
				}

			} else
				ajax.dialog.alert("<b>Error</b>", 'no existe el formulario: %s', (_data.formdata.name || _data.formdata.nombre || _data.formdata.form));
		} else
			data = _data;
		return data;
	}
	_addparams = function(_data) {
		var data = {};
		if (_data.hasOwnProperty("params")) {
			data = dojo.mixin(_data, _data.params)
		} else
			data = _data;
		return data;
	}
	_codeData = function(data) {
		for ( var p in data) {
			if (typeof (callback) == "string")
				data[p] = data[p].replace(/\+/gi, "!signomas").replace(/#/g, "!num");
		}
		return data;
	}
	_onlink = function(url, data) {
		_onchange(url, data)
	}
	_save = function(_data_, callback) {
		if (_data_.form) {
			var form = dojo.dijit.registry.byId(_data_.form);
			if (form) {
				if (form.validate()) {
					ajax.dialog.confirm("<b>Guardar Cambios</b>", 'Desea Guardar los Cambios?', function() {
						var data = _getFormData(_data_);
						if (data.url)
							ajax.post(data.url, _statechanged, data, callback);
						else
							ajax.dialog.alert("<b>Error</b>", 'no hay un URL valido');
					});
				} else
					ajax.dialog.alert("<b>Error</b>", 'El formulario contiene data invalida.');
			} else
				ajax.dialog.alert("<b>Error</b>", 'no existe el formulario: ' + _data_.form);
		} else
			ajax.dialog.alert("<b>Error</b>", 'hace falta un formulario.');
		return false;
	};
	_lista = function(data, callback) {
		if (data.form) {
			var form = dojo.dijit.registry.byId(data.form);
			if (form) {
				var data = _getFormData(data);
				if (data.url)
					ajax.get(data.url, _statechangedLista, data, callback);
				else
					ajax.dialog.alert("<b>Error</b>", 'no hay un URL valido');

			} else
				ajax.dialog.alert("<b>Error</b>", 'no existe el formulario: ' + data.form);
		} else
			ajax.dialog.alert("<b>Error</b>", 'hace falta un formulario.');
		return false;
	};

	_form = function(data, callback) {
		if (data.form) {
			var form = dojo.dijit.registry.byId(data.form);
			if (form) {
				var data = _getFormData(data);
				if (data.url) {
					if (data.metodo == 'post')
						ajax.post(data.url, _statechanged, data, callback);
					else
						ajax.get(data.url, _statechanged, data, callback);
				} else
					ajax.dialog.alert("<b>Error</b>", 'no hay un URL valido');

			} else
				ajax.dialog.alert("<b>Error</b>", 'no existe el formulario: ' + data.form);
		} else
			ajax.dialog.alert("<b>Error</b>", 'hace falta un formulario.');
		return false;
	};

	return {
		onchange : _onchange,
		onchange2 : _onchange2,
		onlink : _onlink,
		form : _form,
		save : _save,
		lista2 : _lista,
		buscar : buscar,
		ajax : ajax,
		dialogos : ajax.dialog,
		download : ajax.download,
		getFormData : _getFormData,
		statechanged : _statechanged,
		foco : _setFoco
	}

});
