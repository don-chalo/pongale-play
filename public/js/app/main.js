'use strict';

var app = angular.module('PongalePlay', ['Entidades', 'BibliotecaSrv', 'Componentes', 'ngAnimate', 'Librerias']);

app.controller('AudioController', ['listaReproduccion', '$timeout', '$window', '$document', '$scope', 'audio', 'BandaSrv', 'DiscoSrv', 'TemaSrv', 'getKeyEventCode', 'formatearSegundos', function(listaReproduccion, $timeout, $window, $document, $scope, audio, bandaSrv, discoSrv, temaSrv, getKeyEventCode, FormatearSegundos){
    
    var self = this;
    var indexTrack = -1;
    
    $scope.volMax = audio.getVolumeMax();
    
    $scope.bandas = [];
    $scope.banda = {};
    $scope.discos = [];
    $scope.disco = {};
    $scope.temas = [];
    $scope.tema = {};
    $scope.listaReproduccion = listaReproduccion;
    $scope.info = {};
    $scope.infoPopUp = {};
    $scope.menu = {};
    $scope.muted = false;

    /* (+) Volume */
    $scope.$watch('volume', function(newValue, oldValue){
        var volume = parseInt( newValue ? newValue : 0 );
        audio.setVolume( volume );
        $scope.labelVolume = (volume == 0 ? 'min' : (volume == $scope.volMax ? 'max' : volume));
    });
    
    $scope.setVolume = function($index, $event){
        $scope.volume = parseInt( $index );
    };
    $scope.setVolume( audio.getVolume() );
    /* (-) Volume */
    
    self.seleccionarBanda = function(id){

        $scope.banda.selected = false;;
        $scope.banda = _.find( $scope.bandas, { _id: id } );
        $scope.banda.selected = true;
        $scope.disco = {};
        $scope.temas = [];
        $scope.discos.cargando = true;
        
        var _discos = discoSrv.query({ order : 'ano=1', bandaid: $scope.banda._id }, function($discos){
            $scope.discos = $discos;
        });
        
        _discos.$promise.finally(function(){ $scope.discos.cargando = false });
        _discos.$promise.catch(_catch);
    };
    
    self.seleccionarAlbum = function(index){
        
        $scope.disco.selected = false;
        $scope.disco = $scope.discos[index];
        $scope.disco.selected = true;
        $scope.temas.cargando = true;

        var _temas = temaSrv.query({ discoid: $scope.disco._id, order: 'numero=1' } , function($temas){
            $scope.temas = $temas;
        });
        
        _temas.$promise.finally(function(){ $scope.temas.cargando = false; });
        _temas.$promise.catch(_catch);
    };
    
    self.agregarDiscoALista = function( _index, _cb){
        
        var disco = $scope.discos[ _index ];
        var cb = _cb ? _cb : function() {};

        var _temas = temaSrv.query({ discoid: disco._id, order: 'numero=1' }, function($temas){
            
            for(var i = 0; i < $temas.length; i++){
                $scope.listaReproduccion.addItem({
                    playing: false,
                    temaId: $temas[i]._id,
                    numero: $temas[i].numero,
                    nombre: $temas[i].nombre,
                    disco: $temas[i].disco,
                    discoid: $temas[i].discoid,
                    discoAno: $temas[i].ano,
                    banda: $temas[i].banda,
                    bandaid: $temas[i].bandaid,
                    url: '/tema/' + $temas[i]._id + '/metadata'
                });
            }
            
            cb();
        });

        _temas.$promise.catch(_catch);
    };
    self.agregarTemaALista = function(){
        
        var cb = function(){};
        
        if(arguments.length > 0){
            if(typeof arguments[0] === 'number'){
                var tema = $scope.temas[ arguments[0] ];
                cb = arguments[1] ? arguments[1] : cb;
            }else if(typeof arguments[0] === 'function'){
                cb = arguments[0];
                var tema = $scope.tema;
            }
        }else{
            var tema = $scope.tema;
        }
        
        $scope.listaReproduccion.addItem({
            playing: false,
            temaId: tema._id,
            numero: tema.numero,
            nombre: tema.nombre,
            disco: tema.disco,
            discoid: tema.discoid,
            discoAno: tema.ano,
            banda: tema.banda,
            bandaid: tema.bandaid,
            url: '/banda/' + tema.bandaid + '/disco/' + tema.discoid + '/tema/' + tema._id + '/metadata'
        });

        cb();
        
        $scope.menu.temas = false;
    };

    self.reproducir = function(){
        if(arguments.length > 0){
            var index = arguments[0];
            var tema = $scope.listaReproduccion[ index ];
        }else{
            var tema = _.find( $scope.listaReproduccion, { selected: true } );
            var index = $scope.listaReproduccion.indexOf( tema );
        }
        if(typeof tema !== 'undefined'){
            var _tema = temaSrv.get({ temaid: tema.temaId, opcion: 'metadata' }, function($tema){
                $scope.info = _tema;
                var url = '/tema/' + tema.temaId + '/stream';
                var tocando = audio.play(url, _tema.contentType);

                if(tocando){
                    tema.playing = true;
                    indexTrack = index;
                }
            });

            _tema.$promise.catch(_catch);

            $scope.menu.lista = false;
        }
    };
    self.reproducirTema = function(){
        $scope.listaReproduccion.removeAll();
        if(arguments.length === 0){
            self.agregarTemaALista( function(){ self.reproducir( 0 ); } );
            $scope.menu.temas = false;
        }else{
            var _index = parseInt( arguments['0'] );
            self.agregarTemaALista( _index, function(){ self.reproducir( 0 ); } );
        }
    };
    self.reproducirDisco = function(_index){
        $scope.listaReproduccion.removeAll();
        _index = parseInt( _index );
        self.agregarDiscoALista( _index, function(){ self.reproducir( 0 ); } );
    };
    
    //Selecciona un tema de la lista de temas.
    self.seleccionarTema = function(index){
        $scope.tema.selected = false;
        $scope.tema = $scope.temas[index];
        $scope.tema.selected = true;
    };
    
    //selecciona un tema de la lista de reproducción.
    self.select = function(index, $event){
        if($event.ctrlKey){
            $scope.listaReproduccion[index].selected = !$scope.listaReproduccion[index].selected;
        }else if($event.shiftKey){
            var index_1 = $scope.listaReproduccion.indexOf( _.find( $scope.listaReproduccion, { selected: true } ) );
            if(index_1 > index){
                for(var i = index; i <= index_1; i++){
                    $scope.listaReproduccion[i].selected = true;
                }
            }else{
                for(var i = index_1; i <= index; i++){
                    $scope.listaReproduccion[i].selected = true;
                }
            }
        }else{
            var selected = $scope.listaReproduccion[index].selected;
            $scope.listaReproduccion.forEach(function(item){ item.selected = false; });
            $scope.listaReproduccion[index].selected = true;
        }
    };
    self.previousTrack = function(){
        if(indexTrack > 0 && $scope.listaReproduccion[indexTrack - 1]){
            self.reproducir(indexTrack - 1);
        }
    };
    self.nextTrack = function(){
        if($scope.listaReproduccion.length > (indexTrack + 1) && $scope.listaReproduccion[indexTrack + 1]){
            self.reproducir(indexTrack + 1);
        }
    };
    self.togglePlayPause = function(){
        if(audio.stoped()){
            var _index = -1;
            var _selected = _.find( $scope.listaReproduccion, function(item, index){ if(item.selected){ _index = index; } return item.selected; } );
            if(_selected){
                self.reproducir( _index );
            }else{
                self.reproducir( 0 )
            }
        }else{
            audio.togglePlayPause();
        }
    };
    self.mute = function(){
        $scope.muted = audio.toggleMute();
    };
    self.limpiarLista = function(){
        $scope.listaReproduccion.removeAll();
        indexTrack = -1;
    };
    
    /* (+) Buscador tema (range) */
    $scope.buscador = function(index, event){
        audio.setCurrentTime ( parseInt( index ? index : 0 ) );
    };
    $scope.formatBuscador = function( segundos ){
        return FormatearSegundos(segundos);
    }
    
    audio.timeupdate( function(duration, currentTime) {
        $scope.$apply(function() {
            if(duration){
                $scope.duration = FormatearSegundos(duration);
                $scope.maxTimeRange = parseInt( duration );
            }else{
                $scope.maxTimeRange = 0;
            }
            
            if(currentTime){
                $scope.currentTime = FormatearSegundos(currentTime);
                $scope.currentTimeRange = parseInt( currentTime );
            }else{
                $scope.currentTimeRange = 0;
            }
        });
    });
    /* (-) Buscador tema (range) */

    audio.error(function(err){
        _catch(err);
    });
    
    function MostrarInfo(tema){
        self.mostrarMetadata = false;
        
        var _tema = temaSrv.get({ temaid: tema.temaId, opcion: 'metadata' }, function(){
            self.metadata = _tema;
            self.mostrarMetadata = true;
        });

        _tema.$promise.catch(_catch);
    };
    self.mostrarInfoLista = function(){
        var tema = _.find( $scope.listaReproduccion, { selected: true } );

        MostrarInfo( tema );
        
        $scope.menu.lista = false;
    };
    self.mostrarInfoTema = function(){
        
        var track = {
            temaId: $scope.tema._id,
            discoid: $scope.tema.discoid,
            bandaid: $scope.tema.bandaid,
            opcion: 'metadata'
        };
        
        MostrarInfo( track );
        
        $scope.menu.temas = false;
    };
    
    self.eliminarTema = function(){
        EliminarTemasSeleccionados();
        
        $scope.menu.lista = false;
    };
    
    self.menuListaReproduccion = function(index, $event){
        $event.ctrlKey = false;
        $event.shiftKey = false;
        self.select(index, $event);
        $scope.menu.left = $event.pageX - 5;
        $scope.menu.top = $event.pageY - 5;
        $scope.menu.lista = true;
    };
    self.menuListaTemas = function($index, $event) {
        $scope.menu.left = $event.pageX - 5;
        $scope.menu.top = $event.pageY - 5;
        $scope.menu.temas = true;
        
        self.seleccionarTema($index);
    };
    self.hideMsg = function(){
        $scope.msg.visible = false;
    };
    self.onKeyDown = function ($event) {
        //46: delete
        if(46 == getKeyEventCode($event)){ EliminarTemasSeleccionados(); }
    };
    self.showInfoPopUp = function(){
        $scope.infoPopUp.show = true;
    };
    self.hideInfoPopUp = function(){
        $scope.infoPopUp.show = false;
    };
    
    audio.ended( function() { self.nextTrack(); });
    
    var _bandas = bandaSrv.query({ order : 'nombre=1' }, function($result, header){
        $scope.bandas = _bandas;
    });
        
    _bandas.$promise.catch(_catch);
    
    function EliminarTemasSeleccionados(){
        var _prev = 0;
        //Cuento los temas anteriores al indexTrack (tema actualmente tocandose).
        $scope.listaReproduccion.forEach( function(item, index){ if(item.selected && index <= indexTrack){ _prev++; } } );
        //Elimino los temas seleccionados.
        $scope.listaReproduccion.setArray( _.reject( $scope.listaReproduccion, function(tema){ return tema.selected; } ) );
        //disminuyo el indexTrack como tantos temas seleccionados anteriores existan.
        indexTrack -= _prev;
    }
    
    $window.addEventListener('resize', function(){
        $scope.$apply(function(){
            $scope.containerHeight = $window.window.innerHeight - 80;
        });
    });
    
    $scope.hideMenu = function(){
        $scope.menu.lista = false;
        $scope.menu.temas = false;
    };
    
    function getEstado(){ 
        if($scope.paused) return '[pausa]';
        if($scope.playing) return '[tocando]';
        else return '';
    };
    
    $scope.$watch('info', function(newValue, oldValue){
        $document.context.title = newValue.title ? getEstado() + newValue.artist[0] + '  - ' + newValue.title : 'PongalePlay';
    });
    
    $scope.$watch(
        function(){
            return audio.getState();
        },
        function(newValue, oldValue){
            $scope.playing = audio.playing();
            $scope.paused = audio.paused();
            $scope.stoped = audio.stoped();
            
            $document.context.title = $scope.info.title ? getEstado() + $scope.info.artist[0] + '  - ' + $scope.info.title : 'PongalePlay';
        }
    );
    
    $scope.$watch(
        function(){
            return indexTrack;
        },
        function(newValue, oldValue){
            if(oldValue > -1 && $scope.listaReproduccion[oldValue]){
                var tema = $scope.listaReproduccion[oldValue];
                tema.playing = false;
            }
        }
    );
    
    $timeout(function(){
        $window.dispatchEvent(new Event('resize'));
    }, 0);
    
    function _catch(err){
        $scope.msg = {
            txt: '¡¡¡Ups, esto no puede ser, Pongale Play presenta problemas!!!',
            type: 'error',
            visible: true
        };
    };
    
}]);
