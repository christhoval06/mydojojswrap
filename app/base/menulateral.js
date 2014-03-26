/**
 * @author Cristobal Barba
 */

define(["dojo", "dijit/registry", "dijit/MenuBar", "dijit/Menu", "dijit/MenuBarItem", "dijit/MenuItem", "dijit/DropDownMenu", "dijit/PopupMenuBarItem", "dijit/PopupMenuItem", "dojo/router", "modulos/layout", "modulos/funciones/funciones", "modulos/ajax/json"], function(dojo, registry, MenuBar, Menu, MenuBarItem, MenuItem, DropDownMenu, PopupMenuBarItem, PopupMenuItem, router, layout, funciones, json) {

    function addSubMenu(item, pSubMenu) {
        if (!item.nomenu) {
            if (!json.isEmpty(item.subitems)) {
                var pop = new PopupMenuItem({
                    label : (item.label).toUpperCase(),
                    disabled : !(!item.disabled),
                    class : item.class || '',
                    data : item
                });

                pop.set('popup', createSubMenu(item));
                pSubMenu.addChild(pop);
            } else {
                pSubMenu.addChild(new MenuItem({
                    label : (item.label).toUpperCase(),
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
        });
        return pSubMenu;
    }

    function onMenuLateralClick(e) {
        dojo.stopEvent(e);
        var itemClicked = this, data = itemClicked.get('data');
        if (data.disabledonclick)
            itemClicked.set('disabled', true);
        if (data.action)
            router.go("/" + data.action);
        if (data.link)
            funciones.onlink(data.link.url, data.link);

    }

    function createMenu(myMenu, item) {
        if (!json.isEmpty(item.subitems)) {
            var pop = new PopupMenuBarItem({
                label : (item.label).toUpperCase(),
                disabled : !(!item.disabled),
                data : item,
                class : item.class || '',
            });
            pop.set('popup', createSubMenu(item));
            myMenu.addChild(pop);
        } else {
            myMenu.addChild(new MenuBarItem({
                label : (item.label).toUpperCase(),
                disabled : !(!item.disabled),
                data : item,
                class : item.class || '',
                onClick : onMenuLateralClick
            }));
        }
    }

    function init(data, place) {
        if (dojo.byId(place)) {
            destroy(place);
            var myMenu = new MenuBar({
                id : place + "__menuaux__",
                style : "font-weight: bold;"
            }, dojo.create("div", {
            }, place || layout.leading()));
            dojo.forEach(data, function(item) {
                createMenu(myMenu, item);
            });
            myMenu.startup();
        }
    }

    function destroy(place) {
        if (registry.byId(place + '__menuaux__')) {
            registry.byId(place + '__menuaux__').destroy();
        }
    }

    return {
        create : init,
        destroy : destroy
    };
});
