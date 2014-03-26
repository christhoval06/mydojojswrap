/**
 * @author Cristobal Barba
 */

 define([
 	"dojo",
 	"dijit/registry",
 	"dojox/grid/DataGrid",
 	"dojox/grid/EnhancedGrid",
 	"dojox/grid/enhanced/plugins/Pagination",
 	"dojox/grid/enhanced/plugins/Filter"],
 	function(dojo, registry, DataGrid, EnhancedGrid, Pagination, Filter){
 	
 	
 		list = function(_id, data, Button, ObjectStore, Memory, router, place, style){
 		    if(data.items.length>0){
     			var editar = function(item, rowIndex, cell){
    		      	var w = new Button({
    		          	label: "Editar",
    					onClick: function(){
    						var id = cell.grid.store.getValue(grid.getItem(rowIndex), 'id');
    						router.go("/"+data.page+"/editar/"+ id);
    					}
    				});
    		    	w._destroyOnRemove=true;
    		   		return w;
    		    },
    		    eliminar = function(item, rowIndex, cell){
    		        var w = new Button({
    		            label: "Eliminar",
    		        	onClick: function(){
    		        		var id = cell.grid.store.getValue(grid.getItem(rowIndex), 'id');
    						router.go("/"+data.page+"/eliminar/"+ id +"/"+(place.split("__")[0]).replace('detalle_',''));
    		        	}
    		        });
    		        w._destroyOnRemove=true;
    		    	return w;
    		    };
    		    data.layout.push({field: 'editar', name: 'Editar', formatter: editar, width: 6, filterable: false});
    		    data.layout.push({field: 'eliminar', name: 'Eliminar', formatter: eliminar, width: 6, filterable: false});
    	        store = new ObjectStore({ objectStore:new Memory({ data: data.items }) });
    			if(registry.byId('lista_' + _id)){
    				registry.byId('lista_' + _id).destroy();
    			}
    			var grid = new EnhancedGrid({
    	            id: 'lista_' + _id,
    	            style: style||"margin: 2% auto 0 auto;" + "float: left;",
    	            store: store,
    				structure: data.layout,
    				rowCount: 50,
    				rowsPerPage: 50,
    				plugins: {
    					pagination: {
    			              pageSizes: ["50", "75", "100", "Todas"],
    			              defaultPageSize: 50,
    			              description: true,
    			              sizeSwitch: true,
    			              pageStepper: true,
    			              gotoButton: true,
    			              maxPageStep: 5,
    			              position: "bottom"
    			        },
    			        filter: {
    		                closeFilterbarButton: true,
    		                ruleCount: 5,
    		                itemsName: "items"
    			        }
    		       	},
    	            autoWidth: true,
    	            autoHeight: true
    	        });
    	        dojo.empty(place||dojo.body());
    	        grid.placeAt(place||dojo.body());
    	        grid.startup();
	        }
 		}
 		
 		return {
 			list: list
 		}
 	}
 	);