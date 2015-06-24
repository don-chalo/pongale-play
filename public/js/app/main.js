'use strict';

function AudioController(listaReproduccion, $timeout, $window, $document, $scope, audio, bandaSrv, discoSrv, temaSrv, getKeyEventCode, FormatearSegundos, metadataSrv){
    
    var self = this;
    var indexTrack = -1;
    
    self.bandas = [];
    self.banda = {};
    self.discos = [];
    self.disco = {};
    self.temas = [];
    self.tema = {};
    self.listaReproduccion = listaReproduccion;
    self.info = {};
    self.infoPopUp = {};
    self.menu = {};
    self.muted = false;
    self.timeRange = { current: 0, max: 0 };
    self.volumeRange = { current: 0, max: audio.getVolumeMax() };

    /* (+) Volume */
    $scope.setVolume = function($index, $event){
        var volume = parseInt( $index );
        audio.setVolume( volume );
        self.labelVolume = (volume == 0 ? 'min' : (volume == self.volumeRange.max ? 'max' : volume));
        self.volumeRange.current = volume;
    };
    $scope.setVolume( audio.getVolume() );
    /* (-) Volume */
    
    self.seleccionarBanda = function(id){

        self.banda.selected = false;;
        self.banda = _.find( self.bandas, { _id: id } );
        self.banda.selected = true;
        self.disco = {};
        self.temas = [];
        self.discos.cargando = true;
        
        var _discos = discoSrv.query({ order : 'ano=1', bandaid: self.banda._id }, function($discos){
            self.discos = $discos;
        });
        
        _discos.$promise.finally(function(){ self.discos.cargando = false });
        _discos.$promise.catch(_catch);
    };
    
    self.seleccionarAlbum = function(index){
        
        self.disco.selected = false;
        self.disco = self.discos[index];
        self.disco.selected = true;
        self.temas.cargando = true;

        var _temas = temaSrv.query({ discoid: self.disco._id, order: 'numero=1' } , function($temas){
            self.temas = $temas;
        });
        
        _temas.$promise.finally(function(){ self.temas.cargando = false; });
        _temas.$promise.catch(_catch);
    };
    
    self.agregarDisco = function( _index, _cb){
        
        var disco = self.discos[ _index ];
        var cb = _cb ? _cb : function() {};

        var _temas = temaSrv.query({ discoid: disco._id, order: 'numero=1' }, function($temas){
            
            for(var i = 0; i < $temas.length; i++){
                self.listaReproduccion.addItem({
                    playing: false,
                    temaId: $temas[i]._id,
                    numero: $temas[i].numero,
                    nombre: $temas[i].nombre,
                    disco: $temas[i].disco,
                    discoid: $temas[i].discoid,
                    discoAno: $temas[i].ano,
                    banda: $temas[i].banda,
                    bandaid: $temas[i].bandaid
                });
            }
            
            cb();
        });

        _temas.$promise.catch(_catch);
    };
    self.agregarTema = function(){
        
        var cb = function(){};
        
        if(arguments.length > 0){
            if(typeof arguments[0] === 'number'){
                var tema = self.temas[ arguments[0] ];
                cb = arguments[1] ? arguments[1] : cb;
            }else if(typeof arguments[0] === 'function'){
                cb = arguments[0];
                var tema = self.tema;
            }
        }else{
            var tema = self.tema;
        }
        
        self.listaReproduccion.addItem({
            playing: false,
            temaId: tema._id,
            numero: tema.numero,
            nombre: tema.nombre,
            disco: tema.disco,
            discoid: tema.discoid,
            discoAno: tema.ano,
            banda: tema.banda,
            bandaid: tema.bandaid
        });

        cb();
        
        self.menu.temas = false;
    };

    self.reproducir = function(){
        if(arguments.length > 0){
            var index = arguments[0];
            var tema = self.listaReproduccion[ index ];
        }else{
            var tema = _.find( self.listaReproduccion, { selected: true } );
            var index = self.listaReproduccion.indexOf( tema );
        }
        if(typeof tema !== 'undefined'){
            var _tema = temaSrv.get({ temaid: tema.temaId, opcion: 'metadata' }, function($tema){
                var url = '/tema/' + tema.temaId + '/stream';
                var tocando = audio.play(url, _tema.contentType);
                SetInfo( _tema );

                if(tocando){
                    tema.playing = true;
                    if(indexTrack > -1 && self.listaReproduccion[indexTrack] && indexTrack != index){
                        var oldTema = self.listaReproduccion[indexTrack];
                        oldTema.playing = false;
                    }
                    indexTrack = index;
                }
            });

            _tema.$promise.catch(_catch);

            self.menu.lista = false;
        }
    };
    self.reproducirTema = function(){
        self.listaReproduccion.removeAll();
        if(arguments.length === 0){
            self.agregarTema( function(){ self.reproducir( 0 ); } );
            self.menu.temas = false;
        }else{
            var _index = parseInt( arguments['0'] );
            self.agregarTema( _index, function(){ self.reproducir( 0 ); } );
        }
    };
    self.reproducirDisco = function(_index){
        self.listaReproduccion.removeAll();
        _index = parseInt( _index );
        self.agregarDisco( _index, function(){ self.reproducir( 0 ); } );
    };
    
    //Selecciona un tema de la lista de temas.
    self.seleccionarTema = function(index){
        self.tema.selected = false;
        self.tema = self.temas[index];
        self.tema.selected = true;
    };
    
    //selecciona un tema de la lista de reproducción.
    self.select = function(index, $event){
        if($event.ctrlKey){
            self.listaReproduccion[index].selected = !self.listaReproduccion[index].selected;
        }else if($event.shiftKey){
            var index_1 = self.listaReproduccion.indexOf( _.find( self.listaReproduccion, { selected: true } ) );
            if(index_1 > index){
                for(var i = index; i <= index_1; i++){
                    self.listaReproduccion[i].selected = true;
                }
            }else{
                for(var i = index_1; i <= index; i++){
                    self.listaReproduccion[i].selected = true;
                }
            }
        }else{
            var selected = self.listaReproduccion[index].selected;
            self.listaReproduccion.forEach(function(item){ item.selected = false; });
            self.listaReproduccion[index].selected = true;
        }
    };
    self.previousTrack = function(){
        if(indexTrack > 0 && self.listaReproduccion[indexTrack - 1]){
            self.reproducir(indexTrack - 1);
        }
    };
    self.nextTrack = function(){
        if(self.listaReproduccion.length > (indexTrack + 1) && self.listaReproduccion[indexTrack + 1]){
            self.reproducir(indexTrack + 1);
        }
    };
    self.togglePlayPause = function(){
        if(self.isStoped){
            var _index = -1;
            var _selected = _.find( self.listaReproduccion, function(item, index){ if(item.selected){ _index = index; } return item.selected; } );
            if(_selected){
                self.reproducir( _index );
            }else{
                self.reproducir( 0 )
            }
        }else{
            audio.togglePlayPause();
        }
        SetTitle();
    };
    self.mute = function(){ self.muted = audio.toggleMute(); };
    self.limpiarLista = function(){
        self.listaReproduccion.removeAll();
        indexTrack = -1;
    };
    
    /* (+) Buscador tema (range) */
    $scope.buscador = function(index, event){
        audio.setCurrentTime ( parseInt( index ? index : 0 ) );
    };
    $scope.formatBuscador = function( segundos ){
        var obj = FormatearSegundos(segundos);
        return (obj.horas === "0" ? '': obj.horas + ":") + obj.minutos + ":" + obj.segundos;
    }
    
    audio.timeupdate( function(duration, currentTime) {
        $scope.$apply(function() {
            if(duration){
                self.duration = FormatearSegundos(duration);
                self.timeRange.max = parseInt( duration );
            }else{
                self.timeRange.max = 0;
            }
            
            if(currentTime){
                self.currentTime = FormatearSegundos(currentTime);
                self.timeRange.current = parseInt( currentTime );
            }else{
                self.timeRange.current = 0;
            }
        });
    });
    /* (-) Buscador tema (range) */
    
    self.mostrarInfoLista = function(){
        var tema = _.find( self.listaReproduccion, { selected: true } );

        MostrarMetadata( tema );
        
        self.menu.lista = false;
    };
    self.mostrarInfoTema = function(){
        
        var track = {
            temaId: self.tema._id,
            discoid: self.tema.discoid,
            bandaid: self.tema.bandaid,
            opcion: 'metadata'
        };
        
        MostrarMetadata( track );
        
        self.menu.temas = false;
    };
    
    self.eliminarTema = function(){
        EliminarTemasSeleccionados();
        self.menu.lista = false;
    };
    self.menuListaReproduccion = function(index, $event){
        self.select(index, $event);
        self.menu.left = $event.pageX - 5;
        self.menu.top = $event.pageY - 5;
        self.menu.lista = true;
    };
    self.menuListaTemas = function($index, $event) {
        self.menu.left = $event.pageX - 5;
        self.menu.top = $event.pageY - 5;
        self.menu.temas = true;
        
        self.seleccionarTema($index);
    };
    
    self.hideMsg = function(){ self.msg.visible = false; };
    
    self.onKeyDown = function ($event) {
        //46: delete
        if(46 == getKeyEventCode($event)){ EliminarTemasSeleccionados(); }
    };
    
    self.showInfoPopUp = function(){ self.infoPopUp.show = true; };
    self.hideInfoPopUp = function(){ self.infoPopUp.show = false; };
    
    audio.ended(function() {
        $scope.$apply(function(){ SetTitle(); });
        self.nextTrack();
    });

    audio.error(function(err){ $scope.$apply(function(){ _catch(err); }); });
    
    self.hideMenu = function(){
        self.menu.lista = false;
        self.menu.temas = false;
    };
    
    Object.defineProperty(self, "isPlaying", {
        enumerable: true,
        configurable: false,
        get: function(){ return audio.isPlaying(); }
    });
    
    Object.defineProperty(self, "isPaused", {
        enumerable: true,
        configurable: false,
        get: function(){ return audio.isPaused(); }
    });
    
    Object.defineProperty(self, "isStoped", {
        enumerable: true,
        configurable: false,
        get: function(){ return audio.isStoped(); }
    });
    
    function SetInfo(info){
        self.info = info;
        SetTitle();
    }
    function SetTitle(){
        $document[0].title = self.info.title ? "[" + audio.getState() + "] " + self.info.artist[0] + '  - ' + self.info.title : 'PongalePlay';
    }
    
    function MostrarMetadata(tema){
        self.mostrarMetadata = false;
        
        var _tema = temaSrv.get({ temaid: tema.temaId, opcion: 'metadata' }, function(){
            metadataSrv.set( _tema );
            self.mostrarMetadata = true;
        });

        _tema.$promise.catch(_catch);
    };

    function EliminarTemasSeleccionados(){
        var _prev = 0;
        //Cuento los temas anteriores al indexTrack (tema actualmente tocandose).
        self.listaReproduccion.forEach( function(item, index){ if(item.selected && index <= indexTrack){ _prev++; } } );
        //Elimino los temas seleccionados.
        self.listaReproduccion.setArray( _.reject( self.listaReproduccion, function(tema){ return tema.selected; } ) );
        //disminuyo el indexTrack como tantos temas seleccionados anteriores existan.
        indexTrack -= _prev;
    }
    
    function _catch(err){
        self.msg = {
            txt: '¡¡¡Ups, esto no puede ser, Pongale Play presenta problemas!!!',
            type: 'error',
            visible: true
        };
    };
    
    var _bandas = bandaSrv.query({ order : 'nombre=1' }, function($result, header){
        self.bandas = _bandas;
    });
        
    _bandas.$promise.catch(_catch);
}

angular
.module("PongalePlay", ["ngAnimate", "Entidades", "Recursos", 'Directivas', 'Librerias', "Servicios"])
.controller('AudioController', ['listaReproduccion', '$timeout', '$window', '$document', '$scope', 'audio', 'BandaSrv', 'DiscoSrv', 'TemaSrv', 'getKeyEventCode', 'formatearSegundos', "MetadataSrv", AudioController]);
