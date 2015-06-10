var RoutesUtils = require( '../services/controllers-utils' );
var DiscoModel = require( '../models/Disco' );

module.exports = {
    find: function(req, res) {

        for(var attr in req.query){
            if(attr != 'nombre' && attr != 'ano' && attr != 'banda' && attr != 'genero' && attr != 'bandaid' && attr != 'order'){
                return res.status(400).json( { message: 'parametro no valido: [' + attr + ']' } );
            }
        }
        
        var query = {};
                                
        if(req.query.nombre){
            query.nombre = req.query.nombre;
        }
        if(req.query.ano){
            if(/^[0-9]+$/.test(req.query.ano)){
                query.ano = parseInt( req.query.ano );
            }else{
                return res.status(400).json({ message: 'error, numero incorrecto [ano = "' + req.query.ano + '"].' });
            }
        }
        if(req.query.banda){
            query.banda = req.query.banda;
        }
        if(req.query.genero){
            query.genero = req.query.genero;
        }
        if(req.query.bandaid){
            if(/^[0-9a-zA-Z]{1,}$/.test(req.query.bandaid)){
                query.bandaid = req.query.bandaid;
            }else{
                return res.status(400).json({ message: 'error, valor incorrecto [bandaid = "' + req.query.bandaid + '"].' });
            }
        }

        var order = {};
        
        try{
            order = RoutesUtils.getOrderBy(req.query.order);
        }catch(e){
            res.status(400).json( { message: e.message } );
        }
        
        DiscoModel.find(query).sort(order).exec(function(err, result){
            if(err){
                res.status(500).end();
                console.error(err);
                return;
            }
            res.json(result);
        });
    },
    findOne: function(req, res){

        if(!/^[0-9a-zA-Z]{1,}$/.test(req.params.discoid)){
            return res.status(400).json({ message: 'error, valor incorrecto para [' + req.params.discoid + '].' });
        }

        DiscoModel.findOne( { _id: req.params.discoid }, function(err, result){
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
