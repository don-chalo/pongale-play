var instance = require('../schemas/Disco');
var _ = require('underscore');

exports.read = function(query, fc){
    instance
        .find(query, { _id: 1, "nombre": 1, "ano": 1 } )
        .sort({"ano": 1})
        .exec(function(err, result){
            fc(err, result);
        });
};

exports.readTracks = function(bandaid, id, fc){
    instance
        .findOne({ _id: id, bandaid: bandaid }, { "temas": 1 } )
        .exec(function(err, result){
            if(err) fc(err);
            if(result && result.temas){
                result.temas.forEach(function(item, i){ item.indice = i; });
                fc(err, result.temas);
            }else{
                fc(err, []);
            }
        });
};

exports.readTrack = function(bandaid, id, indice, fc){
    try{
    instance
        .findOne({ _id: id, bandaid: bandaid }, { "temas": 1 } )
        .exec(function(err, result){
            if(err) fc(err);
            if(result && result.temas && result.temas[indice]){
                fc(err, result.temas[indice]);
            }else{
                fc(err, undefined);
            }
        });
    }catch(e){
        console.log(e);
        fc(e);
    }
};

exports.readOne = function(bandaid, id, fc){
    var projection = { _id: 1, nombre: 1, ano: 1, bandaid: 1 };
    
    instance
        .findOne({ _id: id, bandaid: bandaid }, projection)
        .exec(function(err, result){
            fc(err, result);
        });
};
