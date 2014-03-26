#!/usr/bin/python
# -*- coding: utf-8 -*-
# Lun Ago 12 11:40 2013
# funcion clases



class clasesc():

    def __init__(self, db, sesion):
        
        self.db = db
        [self.sesionid, self.usuarioid, self.usuario, self.nombre, self.ipaddress, self.claseid] = sesion
        self.permisoid = 46
        self.htmltitulo = 'Clases de Productos'
        self.link = ''
        self.contenedor = ''

    
    def nav(self, req):
        if self.db.noestaautorizado(self.usuarioid, self.permisoid, 'ver') == 0:return 0, '{"success": false, "msg": "No tiene permiso adecuado: %s "}' % self.permisoid    
        [fnt, id, id2, cadena, contenedor] = self.db.datosform("fnt,id,id2,cadena,contenedor", req.form)
        cadena = self.db.sincomillas(cadena)
        id = self.db.numerico(id)
        id2 = self.db.numerico(id2)
        self.contenedor = contenedor

        req.content_type = 'text/html; charset=utf-8'

        if fnt == '' or fnt == 'agregar':return self._agregarnuevo()        
        if fnt == 'lista':  return  self._lista(req)
        if fnt == 'editar':  return  self._editar(id)
        if fnt == 'grabar': return self._grabar(req)
        if fnt == 'eliminar': return self._eliminar(id)
        if fnt=='clases': return self._getClases(req, id)

        return 0, '{"success": false, "msg": "Funcion %s, no implementada...." }' % fnt   

    
    def _getClases(self, req, subcategoriaid):
        [ids, addtodos, cerovalue] = self.db.datosform("ids,addtodos,cerovalue", req.form)
        addtodos = self.db.numerico(addtodos)
        if subcategoriaid == '0':
            subcategoriaid = ''
        else:
            subcategoriaid = 'subcategoriaid=%s' % subcategoriaid
            
        if addtodos == '1':
            addidtolist = {ids.split(',')[0]:"0", ids.split(',')[1]: cerovalue}
        else:
            addidtolist = {}
        sql = '''select claseid,nombre from clases where activo=1 %s order by nombre''' % self.db.makewhere([subcategoriaid], 'and')
        return 0, '''{"success": true, "%s__claseid": %s}''' % (self.contenedor, self.db.sql2dic(ids, sql, addidtolist=addidtolist))
 
 
        
    def _lista(self, req):
        [origenid] = self.db.datosform("origenid", req.form)
        if origenid == '':
            return 0, self.db.dicc2json({'success':True,
                'contenedor': self.contenedor,
                   'title': "Lista de Clases de Productos",
                   'form':{'name': 'listaclases', 'method':'post'},
                   'orden':['boton'],
                   'menulateral': self._menuLateral(),
                   'fields':{
                             'boton': {'name': 'boton', 'td': {"style": "text-align: center;"}, 'value': "Actualizar Lista de Clases", 'lista':{ 'fnt': 'lista', 'contenedor': self.contenedor, 'form': 'listaclases', 'origenid': 'boton', 'url': './web/clases'}, 'type': 'button'}
                             },
                   'lista': self.db.encode('id,nombre,codigo,subcategoriaid', """select c.claseid,c.nombre,c.codigo,sc.nombre from clases c,subcategorias sc where c.activo=1 and c.subcategoriaid=sc.subcategoriaid order by c.nombre""", json1_dic2=2, addkey={'place': "detalle_" + self.contenedor + '__listaclases', 'page': 'clases', 'layout': [{'field':'id', 'name': 'Id', 'datatype': 'number', 'width':5}, {'field': 'nombre', 'name':'Nombre', 'datatype': 'string', 'width':25}, {'field': 'codigo', 'name':'Codigo', 'datatype': 'string', 'width':25}, {'field': 'subcategoriaid', 'name':'SubCategoria', 'datatype': 'string', 'width':25}]})
                   })
        else: 
            return 0, self.db.encode('id,nombre,codigo,subcategoriaid', """select c.claseid,c.nombre,c.codigo,sc.nombre from clases c,subcategorias sc where c.activo=1 and c.subcategoriaid=sc.subcategoriaid order by c.nombre""", json1_dic2=1, addkey={'place': "detalle_" + self.contenedor + '__listaclases', 'page': 'clases', 'layout': [{'field':'id', 'name': 'Id', 'datatype': 'number', 'width':5}, {'field': 'nombre', 'name':'Nombre', 'datatype': 'string', 'width':25}, {'field': 'codigo', 'name':'Codigo', 'datatype': 'string', 'width':25}, {'field': 'subcategoriaid', 'name':'SubCategoria', 'datatype': 'string', 'width':25}]})
    
    def _menuLateral(self):
        return [{'label': "Agregar", 'action': 'clases/agregar'}, {'label': "Lista", 'action': 'clases/lista'}]
    
    def _grabar(self, req):
        [claseid, nombre, codigo, subcategoriaid, activo, nota] = self.db.datosform("claseid,nombre,codigo,subcategoriaid,activo,nota", req.form)
        
        ########## validacion #####
        claseid = self.db.numerico(claseid)
        nombre = self.db.comillasu(nombre, largo=60)
        codigo = self.db.comillasu(codigo, largo=20)
        subcategoriaid = self.db.numerico(subcategoriaid)
        activo = self.db.numerico(activo)
        nota = self.db.comillas(nota, largo=255)
        uc = self.db.comillas(self.usuario)
        ua = self.db.comillas(self.usuario)
        fc = "now()"
        fa = "now()"
        #----------------------------
        if nombre == "NULL": return 0, '{"success": false, "msg": "Nombre requerido"}'
        if codigo == "NULL": return 0, '{"success": false, "msg": "Codigo requerido"}'    
        #--------------------------------
        
        if claseid == '0':
            if self.db.noestaautorizado(self.usuarioid, self.permisoid, 'agregar') == 0:return 0, '{"success": false, "msg": "No tiene permiso adecuado"}'
            claseid = self.db.secuencia("clases_claseid_seq")
            r = self.db.exe_sql("insert into clases (claseid,nombre,codigo,subcategoriaid,activo,nota,uc,ua,fc,fa) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)" % (claseid, nombre, codigo, subcategoriaid, activo, nota, uc, ua, fc, fa))
            if r <> 1:return 0, '''{"success": false, "msg": "<b>Error al crear Clase de Producto</b><p>%s</p>"}''' % r  
            self.db.commit()
            return 0, '{"success": true, "msg": "<b>Clase de Producto creada correctamente</b>"}'   
        
        elif long(claseid) > 0: 
            if self.db.noestaautorizado(self.usuarioid, self.permisoid, 'editar') == 0:return 0, '{"success": false, "msg": "No tiene permiso adecuado"}' 
            r = self.db.exe_sql("update clases set nombre=%s,codigo=%s,subcategoriaid=%s,activo=%s,nota=%s,ua=%s,fa=%s where claseid=%s" % (nombre, codigo, subcategoriaid, activo, nota, ua, fa, claseid))
            if r <> 1:return 0, '{"success": false, "msg": "<b>Error actualizando Clase de Producto</b><p>%s</p>"}' % r
            self.db.commit()
            return 0, '{"success": true, "msg": "<b>Clase de Producto actualizada correctamente</b>"}'  
        else:
            return 0, '{"success": false, "msg": "grabar: no se realizo ninguna operacion"}'
                    
    
    def _mostrar(self, claseid='0'):
        if claseid == '0':
            res = []
        else:
            res = self.db.run_sql("select claseid,nombre,codigo,subcategoriaid,activo,nota,uc,to_char(fc,'dd/mm/yyyy HH24:MI:SS'),ua,to_char(fa,'dd/mm/yyyy HH24:MI:SS') from clases where claseid=%s" % claseid)
        
        if res == []:
            titulo = 'Nueva Clase de Producto'
            btn = 'Guardar Clase de Producto'
            subcategoriaid = claseid = 0
            activo = 1
            nombre = codigo = nota = uc = ua = fc = fa = ''
        else:
            [[claseid, nombre, codigo, subcategoriaid, activo, nota, uc, fc, ua, fa]] = res
            titulo = 'Clase de Producto: %s' % nombre
            btn = 'Actualizar %s' % nombre

        return self.db.dicc2json(self.db.extend(self._getForm(), {'info': '%s:%s:%s:%s' % (uc, ua, fc, fa),
                "title": titulo,
                'menulateral': self._menuLateral(),
                'fields': {
                        'claseid': {'value': claseid},
                        'nombre': {'value': nombre},
                        'codigo': {'value': codigo},
                        'subcategoriaid': {'value': subcategoriaid},
                        'activo': {'checked': (activo == 1 or activo == "1")},
                        'nota': {'value': nota},
                        'boton': {'value': btn}
                } }))
            
         
    
    
    def _editar(self, claseid):
        if self.db.noestaautorizado(self.usuarioid, self.permisoid, 'editar') == 0:return 0, '{"success": false, "msg": "No tiene permiso adecuado"}' 
        return 0, self._mostrar(claseid) 

    def _agregarnuevo(self):
        if self.db.noestaautorizado(self.usuarioid, self.permisoid, 'agregar') == 0:return 0, '{"success": false, "msg": "No tiene permiso adecuado"}'
        return 0, self._mostrar() 

                    
    def _eliminar(self, id):
        if self.db.noestaautorizado(self.usuarioid, self.permisoid, 'eliminar') == 0:return 0, '{"success": false, "msg": "No tiene permiso adecuado"}'
        i = self.db.exe_sql("delete from clases where claseid=%s" % id)
        if i <> 1:return 0, '{"success": false, "msg": "Error al eliminar"}'
        self.db.commit()
        return 0, '{"success": true, "msg": "Clase de Producto eliminado correctamente"}'
    

   
    __nc = "clases"
    
    
    def _getForm(self):
        return {'info': '',
                'success': True,
                "contenedor": self.contenedor,
                "title": "Clase de Producto",
                'orden': ['claseid', 'nombre', 'codigo', 'subcategoriaid', 'activo', 'nota', 'boton'],
                'form': {'name': 'clases', 'method': 'post'},
                'fields': {
                        'claseid':{'type': 'hidden', 'name': 'claseid'},
                        'nombre': {'name': 'nombre', 'required': True, 'validate': True, 'label': 'Nombre:', 'style': "width: 30em", 'maxlength': 60, 'type': 'text'},
                        'subcategoriaid': {"type":"filter", 'required': True, "name": "subcategoriaid", 'style': "width: 30em", "label": "SubCategoria:", 'options': self.db.sql2dic('id,name', '''select subcategoriaid,nombre from subcategorias where activo=1 order by nombre''')},
                        'codigo': {'name': 'codigo', 'required': True, 'validate': True, 'label': 'Codigo:', 'style': "width: 30em", 'maxlength': 20, 'type': 'text'},
                        'activo': {'checked': False, 'name': 'activo', 'value': 0, 'label': 'Activo', 'type': 'checkbox'},
                        'nota': {'name': 'nota', 'label': 'Nota:', "rows": 5, "cols": 50, 'type': 'textarea'},
						'boton': {'name': 'boton', 'td': {"style": "text-align: center;"}, 'save':{ 'fnt': 'grabar', 'form': 'clases', 'origenid': 'boton', 'url': './web/clases'}, 'type': 'button'}
                }
    }
    
    
