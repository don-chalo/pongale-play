var path = require('path');
var fs = require('fs');

var BandaModel = require('../models/Banda');
var DiscoModel = require('../models/Disco');
var TemaModel = require('../models/Tema');


module.exports = function(){
    var _filepathBandas = path.join(__dirname, '../data/bandas.db');
    var _filepathDiscos = path.join(__dirname, '../data/discos.db');
    var _filepathTemas = path.join(__dirname, '../data/temas.db');
    
    
    fs.watchFile(_filepathBandas, function(){
        BandaModel.loadDatabase();
    });
    
    fs.watchFile(_filepathDiscos, function(){
        DiscoModel.loadDatabase();
    });

    fs.watchFile(_filepathTemas, function(){
        TemaModel.loadDatabase();
    });
}