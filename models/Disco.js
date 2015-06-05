var nedb = require('nedb');
var path = require('path');

var _filepath = path.join(__dirname, '../data/discos.db');

var DiscoModel = new nedb({ filename: _filepath, autoload: true });

module.exports = DiscoModel;
