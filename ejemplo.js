
define([
    "dojo",
    "dojo/router",
    "dijit/registry",
    "modulos/form/formulario",
    "modulos/tabs/tabs"
    ],
    function(dojo, router, registry, forms, tabs){
                                
        function agregar(contenedor){
            forms.ruta("/clases/agregar");
            if(!contenedor)
                contenedor = tabs.content(tabs.tab("_app_"), {
                    title: "Nueva Clase",
                    closable: true,
                    ruta: "/clases/agregar"});
            else{
                contenedor = registry.byId(contenedor);
                contenedor.set('title', "Nueva Clase");
            }
            forms.func.ajax.get("../web/clases",function(data){
                if(data.success){
                    forms.form(data, [{
                        label : "Agregar Clase",
                        callback: function(){router.go("/clases/agregar/"+contenedor.get('id'));}
                        },{
                            label : "Listo",
                            callback: function(){tabs.tab("_app_").closeChild(contenedor);}
                            }], contenedor.get('id'), null, "tabla");
                }else{
                    tabs.tab("_app_").closeChild(contenedor);
                    forms.error(data);                        
                }
             },{fnt:'agregar', nocache: new Date().getTime(), contenedor: contenedor.get('id')});
        }
        
        function lista(contenedor){
            forms.ruta("/clases/lista");
            if(!contenedor)
                contenedor = tabs.content(tabs.tab("_app_"), {
                    title: "Lista de Clases",
                    closable: true,
                    ruta: "/clases/lista"});
            else{
                contenedor = registry.byId(contenedor);
                contenedor.set('title', "Lista de Clases");
            }
                
            forms.func.ajax.get("../web/clases",function(data){
                if (data.success) forms.lista(contenedor.get('id')+'__categorias', data, contenedor.get('id'), function(json){
                        if(json.success){
                            if (json.place) {
                                forms.listgrid(contenedor.get('id')+'__categorias', json, json.place);
                            }
                        }else forms.error(data);
                    });
                else{
                        tabs.tab("_app_").closeChild(contenedor);
                        forms.error(data);                        
                    }
            },{fnt:'lista', nocache: new Date().getTime(), contenedor: contenedor.get('id')});
        }
        
        function editar(id, contenedor){
            forms.ruta("/clases/editar/"+id);
            if(!contenedor)
                contenedor = tabs.content(tabs.tab("_app_"), {
                    title: "Clases",
                    closable: true,
                    ruta: "/clases/editar/"+id});
            else{
                contenedor = registry.byId(contenedor);
                contenedor.set('title', "Clases");
                contenedor.set("ruta", "/clases/editar/"+id);
            }
                
            forms.func.ajax.get("../web/clases",function(data){
                if(data.success) {
                    contenedor.set('title', data.title || data.titulo);
                    forms.form(data, [
                        {
                            label : "Agregar Nueva",
                            callback: function(){ router.go("/clases/agregar/"+contenedor.get('id')); }
                        },{
                            label : "Ok", callback: function(){tabs.tab("_app_").closeChild(contenedor);}}
                    ], contenedor.get('id'), null, "tabla");
                } else{
                        tabs.tab("_app_").closeChild(contenedor);
                        forms.error(data);                        
                    }
            },{fnt:'editar', id: id, nocache: new Date().getTime(), contenedor: contenedor.get('id')});
        }
        
        function eliminar(id, contenedor){
            forms.dialogos.confirm('', '<b>Desea eliminar esta Clase?</b>', function(){
                forms.func.ajax.get("../web/clases",function(data){
                    if(data.success) {
                        forms.dialogos.alert('', data.msg, function(){
                            router.go("/clases/lista/"+contenedor);
                        });
                    } else forms.error(data);
                },{fnt:'eliminar', id: id, nocache: new Date().getTime(), contenedor: contenedor});
            });
        }

        var init = function (){
            router.register("/clases/agregar", function(e){
                e.preventDefault();
                agregar();
            });
            router.register("/clases/agregar/:contenedor", function(e){
                e.preventDefault();
                agregar(e.params.contenedor);
            });
            
            router.register("/clases/editar/:id", function(e){
                e.preventDefault();
                editar(e.params.id);
            });
            router.register("/clases/editar/:id/*contenedor", function(e){
                e.preventDefault();
                editar(e.params.id, e.params.contenedor);
            });
            
            router.register("/clases/eliminar/:id", function(e){
                e.preventDefault();
                eliminar(e.params.id);
            });
            router.register("/clases/eliminar/:id/*contenedor", function(e){
                e.preventDefault();
                eliminar(e.params.id, e.params.contenedor);
            });
            
            router.register("/clases/lista", function(e){
                e.preventDefault();
                lista();
            });
            router.register("/clases/lista/:contenedor", function(e){
                e.preventDefault();
                lista(e.params.contenedor);
            });
            router.startup();
        }
  
        return {
            init: init
        };
    });
    