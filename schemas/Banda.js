var nedb = require('nedb');

module.exports = new nedb( { filename: 'data/bandas.db', autoload: true } );
