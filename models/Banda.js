var instance = require('../schemas/Banda');

exports.readAll = function(fc){
    instance
    .find( { } )
    .sort({"nombre": 1})
    .exec( function(err, result){
        fc(err, result);
    });
};

exports.read = function(query, fc){
    instance
    .findOne( { _id: query.id } )
    .exec( function(err, result){
        fc(err, result);
    });
};
