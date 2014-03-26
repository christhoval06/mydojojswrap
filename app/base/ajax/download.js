define(["dojo"], function(dojo) {

    _createIFrame = function(id) {
        if (dojo.byId(id))
            dojo.destroy(dojo.byId(id));
        return dojo.create('iframe', {
            id : id,
            style : "visibility:hidden"
        }, dojo.body())
    }
    _downloadFile = function(file) {
        var oIFrm = _createIFrame('downloadFrame')
        oIFrm.src = file;
    }
    _descargar = function(file) {
        var t = setTimeout(_downloadFile(file), 5 * 1000);
    }

    return {
        descargar : _descargar
    }
});
