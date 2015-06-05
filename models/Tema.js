var nedb = require('nedb');
var path = require('path');

var _filepath = path.join(__dirname, '../data/temas.db');

var TemaModel = new nedb({ filename: _filepath, autoload: true });

module.exports = TemaModel;
