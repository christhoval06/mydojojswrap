/**
 * @author Cristobal Barba
 */

define(["dojo", "dojo/dnd/Moveable", "dijit/registry", "dijit/Menu", "dijit/MenuItem", "dijit/DropDownMenu", "dijit/PopupMenuItem", "dijit/MenuSeparator", "dojo/router", "modulos/layout", "modulos/ajax/json"], function(dojo, Moveable, registry, Menu, MenuItem, DropDownMenu, PopupMenuItem, MenuSeparator, router, layout, json) {

    function addSubMenu(item, pSubMenu) {
        if (!item.nomenu) {
            if (!json.isEmpty(item.subitems)) {
                var pop = new PopupMenuItem({
                    label : (item.label || item.item).toUpperCase(),
                    disabled : !(!item.disabled),
                    class : item.class || '',
                    data : item
                });

                pop.set('popup', createSubMenu(item));
                pSubMenu.addChild(pop);
            } else {
                console.log(pSubMenu);
                pSubMenu.addChild(new MenuItem({
                    label : (item.label || item.item).toUpperCase(),
                    disabled : !(!item.disabled),
                    data : item,
                    class : item.class || '',
                    onClick : onMenuLateralClick
                }));
            }
        }
    }

    function createSubMenu(data) {
        var pSubMenu = new Menu({}), subitems = data.subitems;
        dojo.forEach(subitems, function(item) {
            addSubMenu(item, pSubMenu);
            if(i<(subitems.length-1))  pSubMenu.addChild(new MenuSeparator());
        });
        return pSubMenu;
    }

    function onMenuLateralClick(e) {
        dojo.stopEvent(e);
        var itemClicked = this, data = itemClicked.get('data');
        if (data.action) {
            router.go("/" + data.action);
        }
    }

    function createMenuItem(myMenu, item) {
        if (!json.isEmpty(item.subitems)) {
            var pop = new PopupMenuItem({
                label : (item.label || item.item).toUpperCase(),
                disabled : !(!item.disabled),
                data : item,
                class : item.class || '',
            });
            pop.set('popup', createSubMenu(item));
            myMenu.addChild(pop);
        } else {
            myMenu.addChild(new MenuItem({
                label : (item.label || item.item).toUpperCase(),
                disabled : !(!item.disabled),
                data : item,
                class : item.class || '',
                onClick : onMenuLateralClick
            }));
        }
    }
    
    function createMenu(menuData, place, data){
        data = dojo.mixin({ "menuid": "menucxt", "divid": "_menucxt_"}, data);
        var myMenu = new Menu({id: data.menuid, style: "font-weight: bold;"},dojo.create("div",{id: data.divid}, place || dojo.body()));
        dojo.forEach(menuData,function(item, i){
            createMenuItem(myMenu, item);
            if(i<(menuData.length-1))  myMenu.addChild(new MenuSeparator());
         });
         myMenu.startup();
         new Moveable(dojo.byId(data.divid));
    }

    function init(data, place) {
        destroy();
        createMenu(data, place);
    }

    function destroy(data) {
        data = dojo.mixin({ "menuid": "menucxt"}, data);
        if (registry.byId(data.menuid))
            registry.byId(data.menuid).destroy();
    }

    return {
        menu: createMenu,
        create : init,
        destroy : destroy
    };
});
