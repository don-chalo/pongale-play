/*
 * @description
 * Clase que cumple una función de librería para la capa de controladores.
 *
 * @params
 * obj: objeto con los atributos sobre los cuales se realizará la busqueda.
 * attrs: Array con los atributos válidos para la busqueda, en caso de que 'obj' tenga un atributo que no se encuentre especificado en 'attrs' se retornará un error.
 * fc: callback que recibe dos parámetros, error (en caso de existir un error, null en caso contrario) y query (objeto con los atributos sobre los cuales se realizará la búsqueda).
 *
 * @return
 * void
 */

module.exports.getQuery = function(obj, attrs, fc){
    
    if(typeof fc !== 'function') throw new Error('tercer parametro debe ser una función');
    
    if(3 != arguments.length) return fc( new Error('Faltan parametros requeridos') );

    var query = {};
    
    attrs.forEach(function(attr, index){
        
        if('undefined' !== typeof obj[attr] && null !== obj[attr]){
            query[attr] = obj[attr];
            
            delete obj[attr];
        }
    });
    
    for(var attr in obj){
        return fc( new Error('parametro "' + attr + '" no es válido.'), null );
    }
    
    //atributo aplicado tanto a bandas, discos como temas.
    if(query.genero){
        query.genero = new RegExp( query.genero );
    }
    
    //atributo aplicado tanto a bandas, discos como temas.
    if(query.nombre){
        query.nombre = new RegExp( query.nombre );
    }
    
    //atributo aplicado tanto a discos como temas.
    if(query.ano){
        if(/^[0-9]+$/.test(query.ano)){
            query.ano = parseInt( query.ano );
        }else{
            return fc( new Error('error, numero incorrecto [ano = "' + query.ano + '"].'), null );
        }
    }
    
    //atributo aplicado a los temas.
    if(query.numero){
        if(/^[0-9]+$/.test(query.numero)){
            query.numero = parseInt( query.numero );
        }else{
            return fc( new Error('error, numero incorrecto [numero = "' + query.numero + '"].'), null );
        }
    }
    
    //atributo aplicado tanto a discos como temas.
    if(query.banda){
        query.banda = new RegExp( query.banda );
    }
    
    //atributo aplicado a temas.
    if(query.disco){
        query.disco = new RegExp( query.disco );
    }
    
    //atributo aplicado a bandas, discos y temas.
    if(query.bandaid){
        query.bandaid = query.bandaid;
    }
    
    //atributo aplicado tanto a discos como temas.
    if(query.discoid){
        query.discoid = query.discoid;
    }
    
    fc(null, query);
}

module.exports.getOrderBy = function(order){
    
    var _order = {};
    
    if(order){
        if(/[a-zA-Z0-9]\=[\-]?1(%[a-zA-Z0-9]\=[\-]?1)*/.test(order)){
            //order=nombre=1
            var attrs = order.split('%');

            attrs.forEach(function(attr){
                _order[attr.split('=')[0]] = parseInt(attr.split('=')[1]);
            });
        }else{
            throw new Error('sintaxis incorrecta para sentencia order');
        }
    }
    
    return _order;

}
