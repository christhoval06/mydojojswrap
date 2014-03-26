define([
"dojo",
"dojo/router",
"dijit/registry",
"modulos/ajax/dialog",
"modulos/ajax/ajax",
"modulos/form/formulario",
], function(dojo, router, registry, dialog, ajax, formulario){
	
	login = function(callback){
	  ajax.get("../web/islogin", function(data){
	      if(data.success){
	          dojo.query(dojo.body()).data("usuario", data.nombre);
	          if(callback) callback();
	      }else 
	           formLogin(callback, data.text);
      });
	};
	
	rutas = function(layout){
	    router.register("/login/logout", function(e) {
            e.preventDefault();
            ajax.get("../web/logout", function(data) {
                window.location.href = document.location;
                formLogin(layout, 'Bienvenido');
            });
        });
        router.register("/login/cambiausuario", function(e) {
            e.preventDefault();
            formLogin(null,'Cambio de Usuario');
        });
        router.startup();  
	};
	
	__hacerLogin = function(dlg, callback){
	    ajax.post("../web/hacerlogin", function(data){
	        if(data.success){
	            dlg.destroy();
	            if(callback) callback();
	            dojo.query(dojo.body()).data("usuario", data.nombre);
            }else{
                dlg.set('title', '<b>'+data.text+'</b>')
                dijit.byId('dialogoContenido__formlogin').reset();
            }}, formulario.getFormData({
                                        "form" : "dialogoContenido__formlogin",
                                        "variables" : ["nombre", "clave"],
                                        "origenid" : "boton",
                                        "fnt" : "hacerlogin"
                                    }, false));
    };
                                
	formLogin = function(callback, titulo){
        dlg = dialog.custom('<b>' + titulo + '</b>', '', [
                                {label : "ENTRAR", callback: function(dlg){__hacerLogin(dlg, callback);}}]);
        dojo.place('<img  id="logo" class="logo" src="http://servilabsa.com/images/servilab.jpg" ><div id="login"></div>', 'dialogoContenido','before');                            
        formulario.form({
                  "success": true,
                  "form": { "name": "formlogin", "method": "post"},
                  "orden": ["nombre", "clave"],
                  "fields": {
                      "nombre": {"label": "Usuario:", "type": "text", "name": "nombre", "placeHolder": "nombre del Usuario" },
                      "clave": {"label": "Clave:", "type": "password", "name": "clave", "placeHolder": "clave del Usuario", onKeyPress: function(e){
                          if(e.keyCode==13){
                              __hacerLogin(dlg.dialogo, callback);
                          }
                          
                      }}
                      }
        }, null, 'dialogoContenido', null, "tabla");
    };
    
    
    rutasForm = function(){                          
        formulario.form({
                  "success": true,
                  "form": { "name": "ruta_from", "method": "post"},
                  "orden": ["ruta_from_ruta", "ruta_from_go"],
                 "fields": {
                      "type":"design",
                      "orden": [ "row0"],
                      "row0": {
                          "ruta_from_ruta": {"label": "Ruta:", "type": "text", "name": "ruta_from_ruta", "placeHolder": "escriba aqui la ruta si la conoce", 'style': "width: 40em"},
                          "ruta_from_go": {"type": "boton", "name": "ruta_from_go", value: " Ir ", onClick: function(){
                              ruta = registry.byId("rutas_formulario__ruta_from_ruta").get('value');
                              if(!ajax.isEmpty(ruta)){
                                  var i, j, result, routeObj, enrutar = false;
                                  routes = router._routes;
                                  for(i=0, li=routes.length; i<li; ++i){
                                      routeObj = routes[i];
                                      result = routeObj.route.exec(ruta);
                                      if(result) enrutar = true;
                                  }
                                  
                                  if(enrutar) router.go(ruta);
                                  else {
                                      dialog.alert("", "<p><b>la ruta "+ ruta +" no existe</b><p>", function(){ registry.byId("rutas_formulario__ruta_from_ruta").set('value', '');});
                                  }
                              }else
                                dialog.alert("", "<p><b>Debe especificar una ruta</b><p><p><b>formato: /pagina/funcion!/?id</b><p>");
                          }},
                          "orden": ["ruta_from_ruta", "ruta_from_go"]
                      }
                      }
        }, null, "rutas_formulario");
    };

	
	return {
	    login: login,
		form: formLogin,
		rutas: rutas,
		rutasForm: rutasForm
	}
});
