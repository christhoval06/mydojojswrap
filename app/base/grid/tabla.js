/**
 * @author Cristobal Barba
 */

define([
    "dojo",
    "dojo/router",
    "modulos/form/field",
    "dojo/NodeList-data"
    ],
    function(dojo, router, field){
        
        create = function(id, data, place){
            
            if(dojo.byId(id)) dojo.destroy(dojo.byId(id));
            
            /********************DIVS********************/
            var tablediv = dojo.create('div', {id: id, style: data.style || "width: 100%; height: 100%;", class: 'cristobal-tabla-div'}, place),
            headerdiv = dojo.create('div', {id: id + '-header-div', style: "width: 100%; height: 100%;", class: 'cristobal-tabla-header-div'}, tablediv),
            bodydiv = dojo.create('div', {id: id + '-body-div', style: "width: 100%; height: 100%;", class: 'cristobal-tabla-body-div'}, tablediv),
            footerdiv = dojo.create('div', {id: id + '-footer-div', style: "width: 100%; height: 100%;", class: 'cristobal-tabla-footer-div'}, tablediv),
           
            /******************TABLAS********************/
           headertable = dojo.create('table', {id: id + '-header-table', style: "width: 100%; height: 100%;", class: 'cristobal-tabla'}, headerdiv),
           bodytable = dojo.create('table', {id: id + '-body-table', style: "width: 100%; height: 100%;", class: 'cristobal-tabla'}, bodydiv),
           footertable = dojo.create('table', {id: id + '-footer-table', style: "width: 100%; height: 100%;", class: 'cristobal-tabla'}, footerdiv),
           
           header = headertable.createTBody(),
           body = bodytable.createTBody(),
           footer = footertable.createTBody(),
           
           anchos = {};
           
           
           /********************HEADER***********************/
           var thead = header.insertRow();
           data.header.forEach(function(head){
               //var th = thead.insertCell();
               var toolid = head.tooltip ? "_" + new Date().getTime(): null,
               th = dojo.create('th', {id: toolid, class: 'cristobal-tabla-th', style: "width:"+ head.ancho +"em;"}, thead);
               dojo.create('div', {class: 'cristobal-tabla-th-label', innerHTML: head.html}, th);
               anchos[head.id] = head.ancho;
               if(head.tooltip){
                   new dojo.dijit.Tooltip({ connectId: toolid, label: head.tooltip });
               }
           });
                                
           /********************BODY***********************/
           data.body.forEach(function(row){
               var tbody = body.insertRow(body.rows.length);
               for(var ancho in anchos){
                   var td = dojo.create('td', {class: 'cristobal-tabla-td', style: "width:"+ anchos[ancho] +"em;"}, tbody);
                    dojo.create('div', {class: 'cristobal-tabla-td-label', innerHTML: row[ancho]}, td);
               }
           });
          
           /********************FOOTER***********************/
          data.footer.forEach(function(row){
               var tfoot = footer.insertRow();
               for(var ancho in anchos){
                   var th = dojo.create('th', {class: 'cristobal-tabla-th', style: "width:"+ anchos[ancho] +"em;"}, tfoot);
                    dojo.create('div', {class: 'cristobal-tabla-th-label', innerHTML: row[ancho] || ''}, th);
               }
           });

        } 
        
        
        tabla_ponpeada = function(data, place, id, alto, fija){
           if(dojo.byId(place)){
               dojo.destroy(dojo.byId(id));
               if(!dojo.byId(id)){
                   id = id || data.id;
                   alto = alto || data.alto;
                   fija = fija || data.fija;               
                   var anchos = {},
                   
                   //header                
                   rowTable = dojo.create('table', { class : "dojoxGridRowTable", style: "" ,border : 0, cellspacing: 0, cellpadding: 0 }, place),
                   
                   headerBody = rowTable.createTBody(),
                   thead = headerBody.insertRow();
                    
                   data.header.forEach(function(head){
                      var toolid = head.tooltip ? "_" + new Date().getTime(): null,
                      columnheader = dojo.create('th', {id: toolid, class: 'dojoxGridCell dojoDndItem ', style: "width:"+ head.ancho +"em;"}, thead);
                      dojo.create('div', { style: "padding: 3px;", class: 'tablaCeldaLabel', innerHTML: head.html}, columnheader);
                      anchos[head.id] = head.ancho;
                      if(head.tooltip){
                          new dojo.dijit.Tooltip({ connectId: toolid, label: head.tooltip, position:['above', 'below'] });
                      }
                   });
                   
                   var anchotabla = parseInt(rowTable.offsetWidth);
                   var viewsHeaderNode = dojo.create('div', { class : "dojoxGridMasterHeader", style : "display: block; height: 23px;" }),
                   headerContentNode = dojo.create('div', { style: "width:9000em;" });
                   
                   dojo.place(rowTable, headerContentNode);
                   
                   var  master = dojo.create('div', { id: id, class : "dojoxGrid", style : "margin: 2% auto 0px; height: auto; width: "+ (anchotabla +1) + "px;" }, place),
                   headerNode = dojo.create('div', { class : "dojoxGridHeader", style: "width: "+ anchotabla +"px; left: 1px; top: 0px;" }, viewsHeaderNode);
                   
                   dojo.place(viewsHeaderNode, master);
                   dojo.place(headerContentNode, headerNode);
                   
                   anchotabla = parseInt(rowTable.offsetWidth);
                   dojo.setStyle(headerNode, {"width" : anchotabla + "px"});
                   dojo.setStyle(master, {"width" : (anchotabla+1) + "px"});
                   
                   
                   //body
                   
                   var bodyContent = dojo.create('div', { style: "position: absolute; left: 0px; top: 0px;" }, place);
                   data.body.forEach(function(item){
                       rowContent = dojo.create('div', {class: "dojoxGridRow"}, bodyContent),
                       rowtable = dojo.create('table', {class: "dojoxGridRowTable", border : 0, cellspacing: 0, cellpadding: 0}, rowContent),
                       rowtableBody = rowtable.createTBody(),
                       rowTableRow = rowtableBody.insertRow();
                       for(var ancho in anchos){
                           var td = dojo.create('td', {class: 'dojoxGridCell', style: "width:"+ anchos[ancho] +"em;"}, rowTableRow);
                            dojo.create('div', { style: "padding: 3px;", class: 'tablaCeldaLabel', innerHTML: item[ancho]}, td);
                       }
                   });
                   var altobody = alto || parseInt(bodyContent.offsetHeight),
                   fija = alto ? !(alto>parseInt(bodyContent.offsetHeight)): false;
                   var viewsNode = dojo.create('div', {class: "dojoxGridMasterView", style: "height: "+ altobody +"px;"}, master),
                   body = dojo.create('div', { class: "dojoxGridView", style: "width: "+ anchotabla +"px; left: 1px; top: 0px;"}, viewsNode),
                   scrollboxNode = dojo.create('div', { class: "dojoxGridScrollbox"}, body),
                   contentNode = dojo.create('div', { class: "dojoxGridContent", style: "height: "+ altobody +"px; width: "+ anchotabla +"px;" + (fija ? "overflow-y: scroll;" : "") }, scrollboxNode);
                   
                   dojo.place(bodyContent, contentNode);
                   altobody = alto || parseInt(bodyContent.offsetHeight)
                   dojo.setStyle(viewsNode, {"height" : altobody + "px"});
                   dojo.setStyle(contentNode, {"height" : altobody + "px"});
                   
                   
                   //footer               
                   var rowTableFooter = dojo.create('table', { class : "dojoxGridRowTable", style: "" ,border : 0, cellspacing: 0, cellpadding: 0 }, place),
                   
                   footerBody = rowTableFooter.createTBody(),
                   tfoot = footerBody.insertRow();
                    
                   data.footer.forEach(function(foot){
                       for(var ancho in anchos){
                          var columnheader = dojo.create('th', { class: 'dojoxGridCell dojoDndItem ', style: "width:"+ anchos[ancho] +"em;"}, tfoot);
                          dojo.create('div', { style: "padding: 3px;", class: 'tablaCeldaLabel', innerHTML: (foot[ancho] || '')}, columnheader);
                       }
                   });
                   var viewsFooterNode = dojo.create('div', { class : "dojoxGridMasterHeader", style : "display: block; height: 23px;" }, master),
                   FooterNode = dojo.create('div', { class : "dojoxGridHeader", style: "width: "+ anchotabla +"px; left: 1px; top: 0px;" }, viewsFooterNode),
                   footerContentNode = dojo.create('div', { style: "width:9000em;" }, FooterNode);
                   
                   dojo.place(rowTableFooter, footerContentNode);
                                      
               }
           } 
        }
        
                
        return {
            create: create,
            tabla: tabla_ponpeada
        };
    });
    
    




/*

{
    header: [
        {id: "nombre", html: "Nombre", ancho: 10, tooltip: "Nombre de la Persona"},
        {id: "apellido", html: "Apellido", ancho: 10},
        {id: "genero", html: "Genero", ancho: 10},
        {id: "estado", html: "estado", ancho: 10}
    ],
    body: [
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Cristobal", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Carlos", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Hugo", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Jose", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Miguel", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Josue", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Esteban", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"},
        {nombre:"Edgar", apellido: "Barba", genero: "M", estado:"Soltero"}
    ],
    footer: [{genero: "93.65"}]
}

*/
