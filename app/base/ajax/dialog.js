define([
"dojo",
"dijit/Dialog",
"dijit/form/Button"
], function(dojo, Dialog, Button){
	var dlg = null,
	alert = function(title, msg, callback, size){
		size= size||300;
		dlg = new Dialog({title: title,"style": "width: " + size + "px;"}).placeAt(dojo.body());
		dojo.create("div", {class: "dijitDialogPaneContentArea", innerHTML: msg}, dlg.containerNode);
		var actionBar = dojo.create("div", {"class": "dijitDialogPaneActionBar"}, dlg.containerNode);
		new Button({"label": "Ok", onClick: function(e){if(callback){callback();} dlg.destroy();}}).placeAt(actionBar);
    	dlg.startup();
    	dlg.show();
	},
	confirm = function(title, msg, callback, size){
		size= size||300;
		dlg = new Dialog({title: title,"style": "width: " + size + "px;"}).placeAt(dojo.body());
		dojo.create("div", {class: "dijitDialogPaneContentArea", innerHTML: msg}, dlg.containerNode);
		var actionBar = dojo.create("div", {"class": "dijitDialogPaneActionBar"}, dlg.containerNode);
		new Button({"label": "Ok", onClick: function(e){if(callback){callback()} dlg.destroy();}}).placeAt(actionBar);
    	new Button({"label": "Cancel", onClick: function(e){dlg.destroy();}}).placeAt(actionBar);
    	dlg.startup();
    	dlg.show();
	},
    options = function(title, msg, options, size){
        size= size||300;
        dlg = new Dialog({title: title,"style": "width: " + size + "px;"}).placeAt(dojo.body());
        dojo.create("div", {class: "dijitDialogPaneContentArea", innerHTML: msg}, dlg.containerNode);
        var actionBar = dojo.create("div", {"class": "dijitDialogPaneActionBar"}, dlg.containerNode);
        
        options.forEach(function(btn){
           new Button({"label": btn.label, onClick: function(e){if(btn.callback){btn.callback();} dlg.destroy();}}).placeAt(actionBar); 
        });
        dlg.startup();
        dlg.show();
    };
   	
	custom = function(title, custommsg, options, callback, place, size){
        size= size||300;
        dlg = new Dialog({title: title,"style": "width: " + size + "px;"}).placeAt(place || dojo.body());
        content = dojo.query(dojo.create("div", {id: 'dialogoContenido', class: "dijitDialogPaneContentArea", innerHTML: custommsg}, dlg.containerNode))[0];
        var actionBar = dojo.create("div", {"class": "dijitDialogPaneActionBar"}, dlg.containerNode);
        
        options.forEach(function(btn){
           new Button({"label": btn.label, onClick: function(e){if(btn.callback){btn.callback(dlg);}}}).placeAt(actionBar); 
        });
        dlg.startup();
        if(callback) callback()
        dlg.show();
        
        return {dialogo: dlg, content: content};
    };
    
    return {
        alert: alert,
        confirm: confirm,
        options: options,
        custom: custom
    }
});