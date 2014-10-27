var BandaSchema = require('../schemas/Banda');
var DiscoSchema = require('../schemas/Disco');

var fs = require('fs');
var _ = require('underscore');
var mm = require('musicmetadata');


module.exports = function(cfg){

    var self = this;
    
    var lista = [];
    var temasActualizados = [];
    var temasNoActualizados = [];
    var index = 0;
    var inicio = 0;
    var limite = 50;
    var streams = [];
    var callback;

    
    self.execute = function(fc){
        if(cfg.inicializarDB){
            
            BandaSchema.remove({}, { multi: true }, function(err, result){
                if(err) throw err;

                DiscoSchema.remove({}, { multi: true }, function(err, result){
                    if(err) throw err;

                    Leer(lista, cfg.path, cfg.noIncluir, cfg.tipos);
                    Grabar();
                    callback = fc;
                });
            });
        }
    };
    
    function Leido(){
        streams.forEach(function(item, i){
            item.destroy();
        });
        streams = [];
        
        console.log('temasActualizados: ' + temasActualizados.length);
        console.log('temasNoActualizados: ' + temasNoActualizados.length);
        
        inicio = index;
        if( inicio == lista.length){
            var result = GenerarObjetos( temasActualizados );
            Persist( result );
        
            if(callback && typeof callback === 'function'){
                callback();
            }
        }else{
            Grabar();
        }
    }

    function Grabar(){
        for(var i = index; i < (inicio + limite) && i < lista.length; i++){
            MetadataReader( lista[i].path, temasActualizados );
        }
    }

    function GenerarObjetos(temas){
        console.log('generando modelo...');
        var array = [];
        var bandas = _.groupBy( temas, 'banda' );
        
        for(var attr in bandas){
            var banda = {
                nombre: attr,
                genero: bandas[attr][0].genero,
                discos: []
            };
            var discos = _.groupBy( bandas[attr], 'disco' );
            
            for(var d in discos){
                
                var disco = {
                    nombre: d,
                    ano: discos[d][0].ano,
                    temas: discos[d]
                };
                
                disco.temas.forEach(function(tema, j){
                    delete tema.banda;
                    delete tema.genero;
                    delete tema.disco;
                    delete tema.ano;
                    tema.path = tema.path.replace(cfg.path, '');
                });
                
                banda.discos.push( disco );
            }
            array.push( banda );
        }
        
        return array;
    }
    
    function TemaNoLeido(path){
        temasNoActualizados.push({ path: path });
        console.log('no leido: ' + path);
        index++;
        if(index == (inicio + limite) || index == lista.length){
            Leido();
        }
    }

    function TemaLeido(path){
        index++;
        if(index == (inicio + limite) || index == lista.length){
            Leido();
        }
    }

    function MetadataReader(path, array){
        var stream = fs.createReadStream(path);
        var parser = mm(stream);
        
        streams.push(stream);
        parser.on('metadata', function (metadata, err) {
            var tema = {};

            tema.path = path;
            tema.banda = metadata.artist[0];
            tema.genero = metadata.genre;


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

            var nombreTema;
            if(/^\d{1,4}\ \-\ /.test(metadata.title)){
                nombreTema = metadata.title.replace(/^\d{1,4}\ \-\ /, '');
            }else{
                nombreTema = metadata.title;
            }

            tema.nombre = nombreTema;
            tema.numero = metadata.track.no;

            array.push(tema);
        });
        parser.on('done', function (err) {
            if (err){
                console.log(err);
                TemaNoLeido( stream.path );
            }else{
                TemaLeido( stream.path );
            }
        });
    }
    
    function Persist(bandas){
        console.log('grabando en bd');

        var array = [];
        for(var i in bandas) array.push( { nombre: bandas[i].nombre, genero: bandas[i].genero } );
        
        BandaSchema.insert(array, function(err, docs){
            if(err) throw err;
            
            BandaSchema
                .find( {}, function(err, docs){
                    if(err) throw err;

                    var arrayDiscos = [];

                    for(var i in docs){
                        var banda = _.findWhere(bandas, { nombre: docs[i].nombre });

                        if(!banda) console.log(docs[i].nombre + ' not found');

                        for(var j in banda.discos) arrayDiscos.push( { bandaid: docs[i]._id, nombre: banda.discos[j].nombre, ano: banda.discos[j].ano, temas: banda.discos[j].temas });

                        if(0 == arrayDiscos.length)
                            console.log('Banda: ' + banda.nombre + '; ' + docs[i]._id + '; discos: ' + arrayDiscos.length);
                    }
                    DiscoSchema.insert(arrayDiscos, function(err, docs){ if(err) throw err; });
                });
        });
    }
    
    function Leer(array, path, noIncluir, tipos){
        for(var no in noIncluir){
            if(path.toLowerCase().lastIndexOf(noIncluir[no].toLowerCase()) > -1){
                return;
            }
        }

        var stats = fs.lstatSync(path);

        if(stats.isDirectory()){
            var files = fs.readdirSync(path);
            for(var i in files){
                Leer(array, path + '/' + files[i], noIncluir, tipos);
            }
        }else{
            for(var tipo in tipos){
                if(path.toLowerCase().lastIndexOf(tipos[tipo]) == (path.length - tipos[tipo].length)){
                    array.push( { path: path } );
                }
            }
        }
    }
}
