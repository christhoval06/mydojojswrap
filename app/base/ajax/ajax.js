define([
	"dojo",
	"dojox/widget/Standby",
	"modulos/ajax/loader",
	"modulos/ajax/dialog",
	"modulos/ajax/json",
	"modulos/ajax/download"
], function(dojo, Standby, loader, dialog, json, download){
    
    showLoading = function(target){
        target = target || "body" ;
        if(!dojo.dijit.registry.byId('standby')){
            new Standby({id: 'standby', target: target});
            dojo.body().appendChild(dojo.dijit.registry.byId('standby').domNode);
            dojo.dijit.registry.byId('standby').startup();  
        }
        dojo.dijit.registry.byId('standby').show();
     }
     
     hideLoading = function(){
         if(dojo.dijit.registry.byId('standby')){
             dojo.dijit.registry.byId('standby').hide();
             dojo.dijit.registry.byId('standby').destroy();
         }
            
     }
     show = function(place, type){
         loader.create(type || 'gen', place || dojo.body());
     }
     
     hide = function(){
         loader.destroy()
     }
     
	return{
	    show: show,
	    hide: hide,
		get: function(url, callback, data, rcallback, type, showLoading){
		    showLoading =  showLoading != false;
		    if(showLoading) show();
			dojo.xhrGet({
				url : url,
				content : data || {},
				handleAs : type || 'json'
			}).then(
				function(result) {
					if(callback) callback(result, rcallback);
					hide();
				},
				function(e) {
				   dialog.alert("<b>Error</b>", '<h2>Ha ocurrido un error</h2>');
				   hide();
					console.log(e);
				});
		},
		post: function(url, callback, data, rcallback, type, showLoading){
		    showLoading =  showLoading != false;
		    if(showLoading) show();
			dojo.xhrPost({
				url : url,
				content : data || {},
				handleAs : type || 'json'
			}).then(
				function(result) {
					if(callback) callback(result, rcallback);
					hide();
				},
				function(e) {
				    dialog.alert("<b>Error</b>", '<h2>Ha ocurrido un error</h2>');
				    hide();
					console.log(e);
				});
		},
		JSONquery: json.JSONquery, 
		toJson: json.toJson,	
		toObject: json.toObject,
		isEmpty : json.isEmpty,
		
		showLoading: showLoading,
		hideLoading: hideLoading,
		
		arrayUnique: json.arrayUnique,
		dialog : dialog,
		download: download
	}
 
});