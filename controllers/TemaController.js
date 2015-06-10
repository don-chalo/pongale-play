var fs = require('fs');
var mm = require('musicmetadata');
var mime = require('mime');

var config = require('../config/scan.json');
var RoutesUtils = require('../services/controllers-utils');
var TemaModel = require('../models/Tema');

module.exports = {
    find: function(req, res) {

        for(var attr in req.query){
            if(attr != 'nombre' &&
               attr != 'numero' &&
               attr != 'banda' &&
               attr != 'genero' &&
               attr != 'bandaid' &&
               attr != 'disco' &&
               attr != 'ano' &&
               attr != 'discoid' &&
               attr != 'order'){
                return res.status(400).json( { message: 'parametro no valido: [' + attr + ']' } );
            }
        }
        
        var query = {};
        
        if(req.query.nombre){
            query.nombre = req.query.nombre;
        }
        if(req.query.numero){
            if(/^[0-9]+$/.test(req.query.numero)){
                query.numero = parseInt( req.query.numero );
            }else{
                return res.status(400).json({ message: 'error, numero incorrecto [ano = "' + req.query.numero + '"].' });
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
        if(req.query.disco){
            query.disco = req.query.disco;
        }
        if(req.query.ano){
            if(/^[0-9]+$/.test(req.query.ano)){
                query.ano = parseInt( req.query.ano );
            }else{
                return res.status(400).json({ message: 'error, numero incorrecto [ano = "' + req.query.ano + '"].' });
            }
        }
        if(req.query.discoid){
            if(/^[0-9a-zA-Z]{1,}$/.test(req.query.discoid)){
                query.discoid = req.query.discoid;
            }else{
                return res.status(400).json({ message: 'error, valor incorrecto para [discoid = "' + req.query.discoid + '"].' });
            }
        }


        var order = {};
        
        try{
            order = RoutesUtils.getOrderBy(req.query.order);
        }catch(e){
            res.status(400).json( { message: e.message } );
        }
        
        TemaModel.find(query).sort(order).exec(function(err, result){
            if(err){
                res.status(500).end();
                console.error(err);
                return;
            }
            res.json(result);
        });
    },
    findOne: function(req, res){

        if(!/^[0-9a-zA-Z]{1,}$/.test(req.params.temaid)){
            return res.status(400).json({ message: 'error, valor incorrecto para [id = "' + req.params.temaid + '"].' });
        }

        TemaModel.findOne( { _id: req.params.temaid }).exec(function(err, result){
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

    },
    getMetadata: function(req, res){

        if(!/^[0-9a-zA-Z]{1,}$/.test(req.params.temaid)){
            return res.status(400).json({ message: 'error, valor incorrecto para [id = "' + req.params.temaid + '"].' });
        }

        TemaModel.findOne( { _id: req.params.temaid }).exec(function(err, result){
            if(err){
                res.status(500).end();
                console.error(err);
                return;
            }

            if(!result){
                res.status(404).end();
                return;
            }

            fs.stat(config.src + result.path, function(err, stat){

                if(err){
                    res.status(500).end();
                    console.error(err);
                    return;
                }

                var stream = fs.createReadStream(config.src + result.path);

                // create a new parser from a node ReadStream
                var parser = mm(stream);

                // listen for the metadata event
                var track = {};
                parser.on('metadata', function (metadata) {
                    var type = mime.lookup(result.path);
                    metadata.contentType = type;
                    track = metadata;
                });

                parser.on('done', function(err){
                    if(err){
                        res.status(500).end();
                        console.error(err);
                    }else{
                        res.json(track);
                    }
                    stream.destroy();
                });

            });
        });

    },
    getStream: function(req, res){

        if(!/^[0-9a-zA-Z]{1,}$/.test(req.params.temaid)){
            return res.status(400).json({ message: 'error, valor incorrecto para [id = "' + req.params.temaid + '"].' });
        }

        TemaModel.findOne( { _id: req.params.temaid }).exec(function(err, result){
            if(err){
                res.status(400).end();
                console.error(err);
                return;
            }

            if(!result){
                res.status(404).end();
                return;
            }

            try{
                res.set('Accept-Ranges', 'none').sendfile(config.src + result.path);
            }catch(e){
                console.error( e );
                res.status(500).end();
                return;
            }
        });

    },
    getCover: function(req, res){

        if(!/^[0-9a-zA-Z]{1,}$/.test(req.params.temaid)){
            return res.status(400).json({ message: 'error, valor incorrecto para [id = "' + req.params.temaid + '"].' });
        }

        TemaModel.findOne( { _id: req.params.temaid }).exec(function(err, result){
            if(err){
                res.status(500).end();
                console.error(err);
                return;
            }

            if(!result){
                res.status(404).end();
                return;
            }

            try{
                var path = config.src + result.path;
                path = path.substr(0, path.toLowerCase().lastIndexOf('/'));

                var album = path.substr(path.toLowerCase().lastIndexOf('/'), path.length);

                var extensiones = ['folder.png', 'folder.jpg', 'folder.jpeg', 'front.png', 'front.jpg', 'front.jpeg', 'cover.png', 'cover.jpg', 'cover.jpeg'];

                extensiones.push( album + '.jpg' );
                extensiones.push( album + '.png' );
                extensiones.push( album + '.jpeg' );

                var stats = false;

                for(var index in extensiones){
                    stats = fs.existsSync( path + '/' + extensiones[index] );
                    if(stats){
                        path = path + '/' + extensiones[index];
                        break;
                    }
                };
            }catch(e){
                res.status(500).end();
                return;
            }

            if(stats){        
                res.sendfile(path);
            }else{
                res.status(404).end();
            }
        });

    }
}
