/**
 * @author Cristobal Barba
 */


define([
				"dojo",
				"dijit/MenuBar", 
				"dijit/MenuBarItem",
				"dijit/PopupMenuBarItem",
				"dijit/PopupMenuItem",
				"dijit/MenuItem", 
				"dijit/DropDownMenu",
				"dijit/MenuSeparator",
				"dijit/registry",
				"dojo/router",
				"modulos/ajax/ajax",
				"dijit/Menu",
			], 
			function(dojo, MenuBar, MenuBarItem, PopupMenuBarItem, PopupMenuItem, MenuItem, DropDownMenu, MenuSeparator, registry, router, ajax){
				
				function addSubMenu(item,padre,pSubMenu){
					if(!item.nomenu){
						if(!ajax.isEmpty(item.subitems)){
							var pop= new PopupMenuItem({
								label: (item.item).toUpperCase(),
								disabled: !(!item.disabled),
								padre: padre,
								class: item.class || '',
								data: item
							});

							pop.set('popup', createSubMenu(item,pop.get('id')));
							pSubMenu.addChild(pop);
						}
						else{
							pSubMenu.addChild(new MenuItem({
								label: (item.item).toUpperCase(),
								disabled: !(!item.disabled),
								data: item,
								padre: padre,
								id: item.id,
								class: item.class || '',
								onClick: onMenuPrincipalClick
							}));
						}
					}
				}
				
				function createSubMenu(data,padre){
					var pSubMenu = new DropDownMenu({}),
					subitems= data.subitems;
					dojo.forEach(subitems,function(item, i){
						addSubMenu(item,padre,pSubMenu);
						if(i<(subitems.length-1))  pSubMenu.addChild(new MenuSeparator());
					});
					return pSubMenu;
				}
				
				function onMenuPrincipalClick(e){
					dojo.stopEvent(e);
					var itemClicked = this,
					data= itemClicked.get('data');
					if(data.ruta)
					    router.go(data.ruta);
					if(data.fnt)
						router.go("/"+ (registry.byId(itemClicked.get('padre')).get('data')).alias +"/"+data.fnt);	
				}
				
				function createMenuItem(myMenu,item){
					if(!item.nomenu){
						if(!ajax.isEmpty(item.subitems)){
							var pop = new PopupMenuBarItem({
								label: (item.item).toUpperCase(),
								disabled: !(!item.disabled),
								padre: myMenu.get('id'),
								data: item,
								class: item.class || '',
							});
							pop.set('popup', createSubMenu(item,pop.get('id')));
							myMenu.addChild(pop);
						}
						else{
							myMenu.addChild(new MenuBarItem({
								label: (item.item).toUpperCase(),
								disabled: !(!item.disabled),
								data: item,
								id: item.id,
								padre: myMenu.get('id'),
								class: item.class || '',
								onClick: onMenuPrincipalClick
							}));	
						}
					}
				}
				
				function createMenu(menuData, place, data){
				    data = dojo.mixin({ "menuid": "menu", "divid": "_menu"}, data);
				    var myMenu = new MenuBar({id: data.menuid, style: "font-weight: bold;"},dojo.create("div",{id: data.divid}, place || dojo.body()));
				    dojo.forEach(menuData,function(item){
				        createMenuItem(myMenu, item);
				     });
				     myMenu.startup();
				}
				
				function init(url, place, callback){
					ajax.get(url,function(json) {
					    if(json.success){
						  createMenu(json.menu, place);
						  if(callback) callback();
						}
					},{nocache: new Date().getTime()});
				}
											
				function destroy(data){
				    data = dojo.mixin({ "menuid": "menu"}, data);
					if(registry.byId(data.menuid))
						registry.byId(data.menuid).destroy();	
				}
		
		return {
		    menu: createMenu,
			create: init,
			destroy: destroy
		};
});