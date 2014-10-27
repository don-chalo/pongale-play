var fs = require('fs');
var mm = require('musicmetadata');
var config = require('../config.json');
var mime = require('mime');

var banda = require('../models/Banda');
var discos = require('../models/Disco');

/* La justificación de por qué se realizo la separación entre Banda-Routes.js y Banda.js es para facilitar la realización de pruebas unitarias sobre Banda.js */
exports["get /"] = function(req, res) {

    banda.readAll(function(err, result){
        if(err) res.send(400);
        res.json(result);
    });
    
};

exports["get /:id"] = function(req, res){

    banda.read({ id: req.params.id }, function(err, result){
        if(err) res.send(400);
        if(result)
            res.json(result);
        else
            res.send( 404 );
    });
    
};

exports["get /:id/disco"] = function(req, res){

    discos.read({ bandaid: req.params.id }, function(err, result){
        if(err) res.send(400);
        res.json(result);
    });
    
};

exports["get /:bandaid/disco/:discoid"] = function(req, res){

    discos.readOne(req.params.bandaid, req.params.discoid, function(err, result){
        if(err) res.send(400);
        if(result)
            res.json(result);
        else
            res.send( 404 );
    });

};

exports["get /:bandaid/disco/:discoid/tema"] = function(req, res){

    discos.readTracks(req.params.bandaid, req.params.discoid, function(err, result){
        if(err){
            res.send(400);
        }
        res.json(result);
    });
    
};

exports["get /:bandaid/disco/:discoid/tema/:indice"] = function(req, res){

    discos.readTrack(req.params.bandaid, req.params.discoid, req.params.indice, function(err, result){
        if(err) res.send(400);

        if(!result){
            res.send( 404 );
            return;
        }
        
        res.json( result );
    });

};

exports["get /:bandaid/disco/:discoid/tema/:indice/metadata"] = function(req, res){

    discos.readTrack(req.params.bandaid, req.params.discoid, req.params.indice, function(err, result){
        if(err) res.send(400);

        if(!result){
            res.send( 404 );
            return;
        }
        
        var stream = fs.createReadStream(config.path + result.path);
        
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
            if(err) res.send(400);
            stream.destroy();
            res.json(track);
        });
    });

};

exports["get /:bandaid/disco/:discoid/tema/:indice/stream"] = function(req, res){

    discos.readTrack(req.params.bandaid, req.params.discoid, req.params.indice, function(err, result){
        if(err) res.send(400);

        if(!result){
            res.send( 404 );
            return;
        }
        res.sendfile(config.path + '/' + result.path);
    });

};

exports["get /:bandaid/disco/:discoid/tema/:indice/cover"] = function(req, res){

    discos.readTrack(req.params.bandaid, req.params.discoid, req.params.indice, function(err, result){
        if(err) throw err;

        if(!result){
            res.send( 404 );
            return;
        }
        
        var path = config.path + result.path;
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
        
        if(stats){        
            res.sendfile(path);
        }else{
            res.send(404);
        }
    });
    
};
