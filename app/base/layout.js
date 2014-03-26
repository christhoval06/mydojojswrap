/**
 * @author Cristobal Barba
 */

define(["dojo", "dijit/registry", "dijit/layout/BorderContainer", "dojox/layout/ContentPane"], function(dojo, registry, BorderContainer, ContentPane) {

    pos = {
        container : function() {
            return 'container_body';
        },
        center : function() {
            return 'body';
        },
        top : function() {
            return 'header';
        },
        foot : function() {
            return 'footer';
        },
        leading : function() {
            return 'left';
        },
        left : function() {
            return 'left';
        }
    }

    createPlace = function(opts, callback) {
        if (!registry.byId(opts.id)) {
            registry.byId(pos.container()).addChild(new ContentPane(opts));

            if (callback) {
                callback();
            }
        }
    }
    createMain = function(place, create) {
        if (!registry.byId(pos.container())) {
            new BorderContainer({
                id : pos.container(),
                style : 'width: 100%; height: 100%;',
                gutters : true,
                /*design:'sidebar',*/
                liveSplitters : false
            }, dojo.create("DIV", null, place || dojo.body()));
            registry.byId(pos.container()).startup();

            if (create) {
                createPlace({
                    id : pos.top(),
                    region : 'top',
                    splitter : false
                });
                createPlace({
                    id : pos.center(),
                    region : 'center',
                    splitter : false,
                    executeScripts : true,
                    scriptHasHooks : true
                });
                createPlace({
                    id : pos.foot(),
                    region : 'bottom',
                    splitter : false,
                    style : 'text-align: center; border: none;'
                });
                createPlace({
                    id : pos.left(),
                    region : 'left',
                    splitter : false,
                    style : "width: 150px;"
                })
                //createPlace({id: pos.leading(), region : 'leading', splitter: false, style: "width: 150px;"})
                //createPlace({id: pos.leading(), region : 'leading', splitter: false, minSize: 150, style: "width: 150px;"})
            }
        }
    }
    init = function(place, create, callback) {
        createMain(place, create);

        if (callback) {
            callback();
        }
    }

    return {
        init : init,
        create : createPlace,
        container : pos.container,
        top : pos.top,
        center : pos.center,
        foot : pos.foot,
        leading : pos.leading
    };
}); 