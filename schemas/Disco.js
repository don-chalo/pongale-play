var nedb = require('nedb');

module.exports = new nedb( { filename: 'data/discos.db', autoload: true } );
