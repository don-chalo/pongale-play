var RoutesUtils = require( '../services/controllers-utils' );
var BandaModel = require( '../models/Banda' );

module.exports = {
    "find": function(req, res) {
    
        for(var attr in req.query){
            if(attr != 'nombre' && attr != 'genero' && attr != 'order'){
                return res.status(400).json( { message: 'parametro no valido: [' + attr + ']' } );
            }
        }
        
        var query = {};
        
        if(req.query.nombre){
            query.nombre = req.query.nombre;
        }
        if(req.query.genero){
            query.genero = req.query.genero;
        }

        var order = {};
        
        try{
            order = RoutesUtils.getOrderBy(req.query.order);
        }catch(e){
            res.status(400).json( { message: e.message } );
        }

        BandaModel.find(query).sort(order).exec(function(err, result){
            if(err){
                res.status(500).end();
                console.error(err);
                return;
            }
            res.json(result);
        });
    },
    "findOne": function(req, res){

        if(!/^[0-9a-zA-Z]{1,}$/.test(req.params.bandaid)){
            return res.status(400).json({ message: 'error, valor incorrecto para [' + req.params.bandaid + '].' });
        }

        BandaModel.findOne( { _id: req.params.bandaid }, function(err, result){
            if(err){
                res.status(500).end();
                console.error(err);
                return;
            }
            
            if(result)
                res.json(result);
            else
                res.status(404).end();
        });

    }
}
