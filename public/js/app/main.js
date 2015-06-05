'use strict';

var app = angular.module('PongalePlay', ['Entidades', 'BibliotecaSrv', 'Componentes', 'ngAnimate', 'Librerias']);

app.controller('AudioController', ['listaReproduccion', '$timeout', '$window', '$document', '$scope', 'audio', 'BandaSrv', 'DiscoSrv', 'TemaSrv', 'getKeyEventCode', 'formatearSegundos', function(listaReproduccion, $timeout, $window, $document, $scope, audio, bandaSrv, discoSrv, temaSrv, getKeyEventCode, FormatearSegundos){
    
    var self = this;
    var indexTrack = -1;
    
    $scope.volMin = audio.getVolumeMin();
    $scope.volMax = audio.getVolumeMax();
    
    $scope.bandas = [];
    $scope.banda = {};
    $scope.disco = {};
    $scope.listaReproduccion = listaReproduccion;
    $scope.info = {};
    $scope.infoPopUp = {};
    $scope.menu = {};

    $scope.muted = false;

    /* (+) Volume */
    $scope.$watch('volume', function(newValue, oldValue){
        var volume = parseInt( newValue ? newValue : 0 );
        audio.setVolume( volume );
        $scope.labelVolume = (volume == $scope.volMin ? 'min' : (volume == $scope.volMax ? 'max' : volume));
    });
    
    self.showVolumeRange = function(){
        $scope.showVolumeRange = true;
    };
    self.hideVolumeRange = function(){
        $scope.showVolumeRange = false;
    };
    $scope.setVolume = function($index, $event){
        $scope.volume = parseInt( $index );
    };
    /* (-) Volume */
    
    self.seleccionarBanda = function(id){

        var banda = _.findWhere( $scope.bandas, { _id: id } );
        
        $scope.bandas.forEach(function(item){ item.selected = false; });
        
        banda.selected = true;
        
        $scope.disco = {};
        
        var _discos = discoSrv.query({ order : 'ano=1', bandaid: banda._id }, function($discos){
            $scope.banda = { _id: banda._id, nombre: banda.nombre, discos: _.sortBy(_discos, "ano") };
        });
        
        _discos.$promise.catch(_catch);
    };
    
    self.seleccionarAlbum = function(index){
        
        var disco = $scope.banda.discos[index];

        $scope.banda.discos.forEach(function(item){ item.selected = false; });
        
        disco.selected = true;
        
        var _temas = temaSrv.query({ discoid: disco._id, order: 'numero=1' } , function($temas){
            $scope.disco = { _id: disco._id, bandaId: $scope.banda._id, nombre: disco.nombre, ano: disco.ano ,temas: _.sortBy(_temas, "numero"), bandaNombre: $scope.banda.nombre };
        });
        
        _temas.$promise.catch(_catch);
    };
    
    self.agregarDiscoALista = function(){
        
        var cb = function() {};
        
        if(arguments.length > 0){            
            if(typeof arguments[0] === 'number'){
                var disco = $scope.banda.discos[ arguments[0] ];
            }else if(typeof arguments[0] === 'function'){
                cb = arguments[0];
                var disco = _.findWhere( $scope.banda.discos, { selected: true } );
            }
        }else{
            var disco = _.findWhere( $scope.banda.discos, { selected: true } );
        }

        var _temas = temaSrv.query({ discoid: disco._id, order: 'numero=1' }, function($temas){
            
            _temas = _.sortBy( _temas, "numero" );
            
            for(var i = 0; i < _temas.length; i++){
                $scope.listaReproduccion.addItem({
                    playing: false,
                    temaId: _temas[i]._id,
                    numero: _temas[i].numero,
                    nombre: _temas[i].nombre,
                    discoNombre: disco.nombre,
                    discoId: disco._id,
                    discoAno: disco.ano,
                    bandaNombre: $scope.banda.nombre,
                    bandaId: $scope.banda._id,
                    url: '/tema/' + _temas[i]._id + '/metadata'
                });
            }
            
            cb();
        });

        _temas.$promise.catch(_catch);
        
        $scope.menu.discos = false;
    };
    self.agregarTemaALista = function(){
        
        var cb = function(){};
        
        if(arguments.length > 0){
            if(typeof arguments[0] === 'number'){
                var tema = $scope.disco.temas[ arguments[0] ];
            }else if(typeof arguments[0] === 'function'){
                cb = arguments[0];
                var tema = _.findWhere( $scope.disco.temas, { selected: true } );
            }
        }else{
            var tema = _.findWhere( $scope.disco.temas, { selected: true } );
        }

        $scope.listaReproduccion.addItem({
            playing: false,
            temaId: tema._id,
            numero: tema.numero,
            nombre: tema.nombre,
            discoNombre: $scope.disco.nombre,
            discoId: $scope.disco._id,
            discoAno: $scope.disco.ano,
            bandaNombre: $scope.disco.bandaNombre,
            bandaId: $scope.disco.bandaId,
            url: '/banda/' + $scope.disco.bandaId + '/disco/' + $scope.disco._id + '/tema/' + tema._id + '/metadata'
        });
        
        cb();
        
        $scope.menu.temas = false;
    };

    self.reproducir = function(){
        var cb = function(){};
        
        if(arguments.length > 0){
            if(typeof arguments[0] === 'number'){
                var index = arguments[0];
                var tema = $scope.listaReproduccion[ index ];
            }else if(typeof arguments[0] === 'function'){
                cb = arguments[0];
                var tema = _.findWhere( $scope.listaReproduccion, { selected: true } );
                var index = $scope.listaReproduccion.indexOf( tema );
            }
        }else{
            var tema = _.findWhere( $scope.listaReproduccion, { selected: true } );
            var index = $scope.listaReproduccion.indexOf( tema );
        }

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
    };
    self.reproducirTema = function(){
        $scope.listaReproduccion.removeAll();
        self.agregarTemaALista( function(){ self.reproducir( 0 ); } );
        
        $scope.menu.temas = false;
    };
    self.reproducirDisco = function(){
        $scope.listaReproduccion.removeAll();
        self.agregarDiscoALista( function(){ self.reproducir( 0 ); } );
        
        $scope.menu.discos = false;
    };
    
    self.seleccionarTema = function(index){
        $scope.disco.temas.forEach(function(item){ item.selected = false; });
        $scope.disco.temas[index].selected = true;
    };
    self.select = function(index, $event){
        if($event.ctrlKey){
            $scope.listaReproduccion[index].selected = !$scope.listaReproduccion[index].selected;
        }else if($event.shiftKey){
            var index_1 = $scope.listaReproduccion.indexOf( _.findWhere( $scope.listaReproduccion, { selected: true } ) );
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
        audio.togglePlayPause();
    };
    self.mute = function(){
        $scope.muted = audio.toggleMute();
    };
    self.limpiarLista = function(){
        $scope.listaReproduccion.removeAll();
    };
    
    /* (+) Buscador tema (range) */
    $scope.buscador = function(index, event){
        audio.setCurrentTime ( parseInt( index ? index : 0 ) );
    };
    
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
        var tema = _.findWhere( $scope.listaReproduccion, { selected: true } );

        MostrarInfo( tema );
        
        $scope.menu.lista = false;
    };
    self.mostrarInfoTema = function(){
        
        var tema = _.findWhere( $scope.disco.temas, { selected: true } );

        var track = {
            temaId: tema._id,
            discoId: $scope.disco._id,
            bandaId: $scope.disco.bandaId,
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
    self.menuListaDiscos = function($index, $event){
        $scope.menu.left = $event.pageX;
        $scope.menu.top = $event.pageY;
        $scope.menu.discos = true;
        
        self.seleccionarAlbum($index);
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
    
    $scope.paneles = {};
    $scope.paneles['column-bandas'] = true;
    $scope.paneles['column-discos'] = true;
    $scope.paneles['column-temas'] = true;
    $scope.paneles['column-lista'] = true;

    self.showPanel = function($event, element){
        $scope.paneles[element] = true;
    };
    self.hidePanel = function($event, element){
        $scope.paneles[element] = false;
    };
    
    audio.ended( function() { self.nextTrack(); });
    
    var _bandas = bandaSrv.query({ order : 'nombre=1' }, function($result, header){
        $scope.bandas = _bandas;
    });
        
    _bandas.$promise.catch(_catch);
    
    function EliminarTemasSeleccionados(){
        $scope.listaReproduccion.setArray( _.reject( $scope.listaReproduccion, function(tema){ return tema.selected; } ) );
    }
    
    $window.addEventListener('resize', function(){
        $scope.$apply(function(){
            $scope.containerHeight = $window.window.innerHeight - 80;
        });
    });
    
    $scope.hideMenu = function(){
        $scope.menu.lista = false;
        $scope.menu.temas = false;
        $scope.menu.discos = false;
    };
    
    function getEstado(){ 
        if($scope.playing) return '';
        if($scope.paused) return '[pausa]';
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
