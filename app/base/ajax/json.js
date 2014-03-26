define([
	"dojo",
	"dojo/json",
	"dojox/json/query"
], function(dojo, JSON, query){
    
        
	return{
	    
		JSONquery: function(q,o){
			return query(q,o);
		},
		
		toJson: function(form){
			return JSON.parse(dojo.formToJson(form));
		},	
		
		toObject: function(form){
			return dojo.xhr.formToObject(form);
		},
		
		isEmpty : function(obj){ 
			if(obj==undefined) return true 
			for(var i in obj){ 
				if(obj.hasOwnProperty(i)) return false; 
			} 
			if (obj.length <1) return true;
			return !obj;

		},
		
		arrayUnique: function(array) {
            var a = array.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
        
            return a;
        }
	}
 
});