define(["dojo", "dijit/registry", "dijit/layout/TabContainer", "dijit/layout/AccordionContainer", "dijit/layout/AccordionPane", "dijit/layout/ContentPane", "dojox/layout/ContentPane", "modulos/ajax/ajax"], function(dojo, registry, TabContainer, AccordionContainer, AccordionPane, DContentPane, ContentPane, ajax) {

    tabId = '_app_tabs_';
    accId = '_app_accs_';

    createTab = function(place, _fromplace) {
        if (registry.byId(tabId))
            return registry.byId(tabId);
        else {
            var tab = new TabContainer({
                id : tabId,
                tabStrip : false,
                useSlider : true,
                doLayout : false,
                padre : _fromplace,
                //style : "height: 100%; width: 100%;"
                style : "width: 100%;"
            }, dojo.create('div', {}, place));
            tab.watch("selectedChildWidget", function(name, oval, nval) {
                ruter = registry.byId("rutas_formulario__ruta_from_ruta");
                dojo.doc.title = nval.get('title') || 'Contabilidad';
                if (ruter)
                    ruter.set('value', nval.ruta || '');
            });
            tab.startup();
            tab.resize();
            return tab;
        }
    }
    createNTab = function(place, _fromplace) {
        if (registry.byId(_fromplace + '__' + accId))
            return registry.byId(_fromplace + '__' + accId);
        else
            var tab = new TabContainer/*AccordionContainer*/({
                nested : true,
                padre : _fromplace,
                id : _fromplace + '__' + accId,
                doLayout : false, /*esto esta ocacionando errores*/
                style : "height: 100%; width: 100%;"
            }, dojo.create('div', {}, place));
        tab.startup();
        tab.resize();
        return tab;
    }
    createContent = function(tabs, data, _fromplace) {
        data = dojo.mixin({
            doLayout : false,
            padre : _fromplace,
            //tabStrip: false,
            style : "width: 100%;",
            onClose : function() {
                t = registry.byId(tabId);
                if (t.getChildren().length <= 1) {
                    t.removeChild(t.getChildren()[0]);
                    t.destroy();
                }
                return true
            }
        }, data);
        var cp = new DContentPane(data);
        if (!tabs._started)
            tabs.startup();
        tabs.addChild(cp);
        tabs.selectChild(cp, true);
        return cp;
    }
    createContentAcc = function(accs, data, _fromplace) {
        if (data.id)
            if ((data.id).indexOf('__') == -1)
                data.id = _fromplace + '__' + data.id;
        data = dojo.mixin({
            doLayout : false,
            padre : _fromplace,
            style : "width: 100%;"
        }, data);
        var cp = new DContentPane(data);
        if (!accs._started)
            accs.startup();
        accs.addChild(cp);
        accs.selectChild(cp, true);
        return cp;
    }

    return {
        tab : createTab,
        nestedTab : createNTab,
        content : createContent,
        tabId : tabId,
        accId : accId,
        contentAcc : createContentAcc,
    }
});
