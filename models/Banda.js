var nedb = require('nedb');
var path = require('path');

var _filepath = path.join(__dirname, '../data/bandas.db');

var BandaModel = new nedb({ filename: _filepath, autoload: true });

module.exports = BandaModel;
