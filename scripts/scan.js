var fs = require('fs');
var _ = require('underscore');
var mm = require('musicmetadata');

var EventEmitter = require('events').EventEmitter;


var BandaModel = require('../models/Banda');
var DiscoModel = require('../models/Disco');
var TemaModel = require('../models/Tema');

var cfg = require('../config/scan.json');

Validacion(cfg);


var archivos = [];
var bandasExistentes = {};

var scanPath = /.+\/$/.test(cfg.src) ? cfg.src.replace(/\/$/, "") : cfg.src;

scanPath = scanPath + ( /^\/.*/.test( cfg.path ) ? cfg.path : "/" + cfg.path );


if(cfg.modo === 'w'){
    BandaModel.remove({}, { multi: true }, function(err, result){ if(err){ console.log(err); } });
    DiscoModel.remove({}, { multi: true }, function(err, result){ if(err){ console.log(err); } });
    TemaModel.remove({}, { multi: true }, function(err, result){ if(err){ console.log(err); } });

    BuscarArchivos(scanPath, cfg.noIncluir, cfg.tipos);
    LeerArchivos(archivos, bandasExistentes);
    
}else if(cfg.modo === 'a'){
    BandaModel.find({}, function(err, result){
        if(err){
            console.log(err);
        }else{
            result.forEach(function(item){
                bandasExistentes[item.nombre] = {
                    nombre: item.nombre,
                    genero: item.genero,
                    _id: item._id
                };
            });

            BuscarArchivos(scanPath, cfg.noIncluir, cfg.tipos);
            LeerArchivos(archivos, bandasExistentes);
        }
    });
}

function BuscarArchivos(path, noIncluir, tipos){
    for(var no in noIncluir){
        if(path.toLowerCase().lastIndexOf(noIncluir[no].toLowerCase()) > -1){
            return;
        }
    }

    var stats = fs.lstatSync(path);

    if(stats.isDirectory()){
        var files = fs.readdirSync(path);
        files.forEach(function(file){
            BuscarArchivos(path + '/' + file, noIncluir, tipos);
        });
    }else{
        tipos.forEach(function(tipo){
            var reg = new RegExp(tipo + '$');
            if(reg.test(path.toLowerCase())){
                archivos.push( path );
            }
        });
    }
}



function LeerArchivos(_archivos, _bandasExistentes){
    var events = new EventEmitter();
    var abiertos = [];
    var bandas = {};

    console.log('Archivos por leer: ', _archivos.length);
    
    events.on('leer', function(path){
        if(_archivos.length > 0){
            if(_archivos.length % 50 == 0){
                console.log('Archivos restantes por leer: ', _archivos.length);
            }
            LeerMetadata( _archivos.shift() );
        }else{
            events.emit('cerrar');
            Create();
        }
    });
    events.on('cerrar', function(){
        var stream = abiertos.shift();

        while(stream !== undefined){
            try{
                stream.close();
            }catch(e){
                console.log(e);
            }finally{
                stream = abiertos.shift();
            }
        }
    });
    events.on('leido', function( tema, stream ){
        abiertos.push( stream );
        
        if(typeof tema !== 'undefined'){
            if( bandas[tema.banda] === undefined ){

                var _nuevaBanda = {
                    nombre: tema.banda,
                    genero: [],
                    discos: {}
                };

                if(_bandasExistentes[tema.banda]){
                    _nuevaBanda._id = _bandasExistentes[tema.banda]._id;
                    _nuevaBanda.genero = _bandasExistentes[tema.banda].genero;
                }

                bandas[tema.banda] = _nuevaBanda;
            }

            //Agrego los generos no existentes en la banda.
            tema.genero.forEach(function(genero){
                if(!_.contains( bandas[tema.banda].genero, genero )){
                    bandas[tema.banda].genero.push( genero );
                }
            });

            //Agrego el disco a la banda, si este no existe.
            if(bandas[tema.banda].discos[tema.disco] === undefined){
                bandas[tema.banda].discos[tema.disco] = {
                    nombre: tema.disco,
                    ano: tema.ano,
                    genero: tema.genero,
                    banda: tema.banda,
                    temas: {}
                };
            }else{
                //Agrego los nuevos generos al disco.
                tema.genero.forEach(function(genero){
                    if(!_.contains( bandas[tema.banda].discos[tema.disco].genero, genero )){
                        bandas[tema.banda].discos[tema.disco].genero.push( genero );
                    }
                });
            }

            bandas[tema.banda].discos[tema.disco].temas[tema.nombre] = tema;
        }

        if(abiertos.length >= 10){
            events.emit('cerrar');
        }
    });

    events.emit('leer');

    function LeerMetadata(path){
        if(typeof path === 'undefined'){
            return;
        }

        var stream = fs.createReadStream(path);
        var parser = mm(stream);

        parser.on('metadata', function (metadata, err) {
            var nombreTema;
            var tema = {};
            
            if(/^\d{1,4}\ \-\ /.test(metadata.title)){
                nombreTema = metadata.title.replace(/^\d{1,4}\ \-\ /, '');
            }else{
                nombreTema = metadata.title;
            }

            tema.nombre = nombreTema;
            tema.numero = metadata.track.no;

            tema.banda = metadata.artist[0];

            var nombreDisco;
            if(/^\d+\ \-\ /.test(metadata.album)){
                nombreDisco = metadata.album.replace(/^\d+\ \-\ /, '');
            }else if(/^\d+\.\d+\ \-\ /.test(metadata.album)){
                nombreDisco = metadata.album.replace(/^\d+\.\d+\ \-\ /, '');
            }else{
                nombreDisco = metadata.album;
            }

            tema.disco = nombreDisco;
            tema.ano = parseInt(metadata.year ? metadata.year : 0);

            tema.genero = metadata.genre;

            tema.path = path.replace(cfg.src, '');
            
            events.emit('leido', tema, stream );
        });
        parser.on('done', function (err) {
            if (err){
                console.log(err);
                console.log('no leido: ' + stream.path );
            }
            events.emit('leer');
        });
    }

    function Create(){
        InsertarBandas();

        function InsertarBandas(){
            var _insertBandas = _.map( bandas, function(value, key){
                var _return = { nombre: value.nombre, genero: value.genero };

                if(value._id){ _return._id = value._id }

                return  _return;
            });

            var _updateBandasExistentes = _.filter( _insertBandas, function(item){ return typeof item._id !== 'undefined'; });
            var _insertBandasNuevas = _.filter( _insertBandas, function(item){ return typeof item._id === 'undefined'; });;

            if(_insertBandasNuevas.length > 0){

                BandaModel.insert( _insertBandasNuevas, function(err, _resultBandas){
                    
                    if(err){ throw err; }
                    
                    _resultBandas.forEach(function( banda ){
                        bandas[banda.nombre]._id = banda._id;
                        _.map( bandas[banda.nombre].discos, function(value, key){
                            value.bandaid = banda._id;

                            _.map( value.temas, function(value, key){
                                value.bandaid = banda._id;
                            });
                        });
                    });
                    InsertarDiscos();
                });
            }

            if(_updateBandasExistentes.length > 0){
                _updateBandasExistentes.forEach(function(_item){
                    
                    bandas[_item.nombre]._id = _item._id;
                    _.map( bandas[_item.nombre].discos, function(value, key){
                        value.bandaid = _item._id;

                        _.map( value.temas, function(value, key){
                            value.bandaid = _item._id;
                        });
                    });
                    
                    BandaModel.update({ _id: _item._id }, { $set: { genero: _item.genero } }, { multi: true }, function(err, result){ if(err){ console.log( err ); } });
                });

                InsertarDiscos();
            }
        }

        function InsertarDiscos(){

            var discos = [];

            for(var banda in bandas){
                for(var disco in bandas[banda].discos){
                    discos.push( {
                        nombre: bandas[banda].discos[disco].nombre,
                        ano: bandas[banda].discos[disco].ano,
                        genero: bandas[banda].discos[disco].genero,
                        banda: bandas[banda].discos[disco].banda,
                        bandaid: bandas[banda].discos[disco].bandaid
                    });
                }
            }

            console.log('discos encontrados: ' + discos.length);
            DiscoModel.insert( discos, function(err, _resultDiscos){

                if(err){ throw err; }

                console.log('Discos insertados: ' + _resultDiscos.length);
                _resultDiscos.forEach(function(disco){
                    bandas[disco.banda].discos[disco.nombre]._id = disco._id;

                    for(var tema in bandas[disco.banda].discos[disco.nombre].temas){
                        bandas[disco.banda].discos[disco.nombre].temas[tema].discoid = disco._id;
                    }
                });

                InsertarTemas();
            });
        }

        function InsertarTemas(){

            var _discos = [];

            _.each( bandas, function(value, key){
                _.each( value.discos, function(value, key){
                    _discos.push( value );
                });
            });

            var _temas = [];

            _.each( _discos, function(disco, key){
                _.each( disco.temas, function(tema, key){
                    tema.discoid = disco._id;

                    _temas.push( tema );
                });
            });

            console.log("Temas encontrados: " + _temas.length.toString());

            TemaModel.insert( _temas, function(err, _resultTemas){

                if(err){ throw err; }

                console.log('Temas insertados: ' + _resultTemas.length);

            });
        }
    }
}

function Validacion(cfg){
    if(typeof cfg.modo === 'undefined'){
        console.log("No se encuentra definido el modo en el cual se ejecutará el script [w: escritura, a: añadir]");
    }

    if(typeof cfg.noIncluir === 'undefined'){
        cfg.noIncluir = [];
    }

    if(typeof cfg.path === 'undefined'){
        console.log("No se encuentra definido el directorio que será leído para el escaneo de los mp3's [atributo \"path\"]");
    }

    if(typeof cfg.src === 'undefined'){
        console.log("No se encuentra definido el directorio raiz en el cual se encuentran los archivos mp3's [atributo \"src\"]");
    }
}

process.on('uncaughtException', function(err){
    console.error(err.stack);
    console.error(err.message);
    process.exit(1);
});
