'use strict';

var app = angular.module('PongalePlay', ['Entidades', 'BibliotecaSrv', 'Componentes', 'ngAnimate', 'Librerias']);

app.controller('AudioController', ['audio', 'BandaSrv', 'DiscoSrv', 'TemaSrv', 'getKeyEventCode', function(audio, bandaSrv, discoSrv, temaSrv, getKeyEventCode){
    
    var self = this;
    var indexTrack = -1;
    var volMin = 0;
    var volMax = 10;
    
    self.bandas = [];
    self.banda = {};
    self.disco = {};
    self.listaReproduccion = [];
    self.info = {};
    self.infoPopUp = {};
    self.menuRightClick = {};

    self.playing = audio.playing();
    self.paused = audio.paused();
    self.stoped = audio.stoped();
    self.muted = false;

    self.estado = function(){ 
        if(self.playing) return '';
        if(self.paused) return '[pausa]';
        if(self.stoped) return '[detenido]';
    };
    
    self.volume = 1;
    self.labelVolume = 1;
    self.cambiarVolume = function(){
        Vol( self.volume );
    };

    Vol( self.volume );

    self.seleccionarBanda = function(id){

        var banda = _.findWhere( self.bandas, { _id: id } );
        
        self.bandas.forEach(function(item){ item.selected = false; });
        
        banda.selected = true;
        
        self.disco = {};
        
        discoSrv.getAll({ bandaId: banda._id }, function($discos){
            self.banda = { _id: banda._id, nombre: banda.nombre, discos: _.sortBy($discos, "ano") };
        });
    };
    
    self.seleccionarAlbum = function(index){
        
        var disco = self.banda.discos[index];

        self.banda.discos.forEach(function(item){ item.selected = false; });
        
        disco.selected = true;
        
        temaSrv.getAll({ bandaId: self.banda._id, discoId: disco._id } , function($temas){
            self.disco = { _id: disco._id, bandaId: self.banda._id, nombre: disco.nombre, ano: disco.ano ,temas: _.sortBy($temas, "numero"), bandaNombre: self.banda.nombre };
        });
    };
    
    self.agregarDiscoALista = function(index){

        var disco = self.banda.discos[index];

        temaSrv.getAll({ bandaId: self.banda._id, discoId: disco._id }, function($temas){
            
            $temas = _.sortBy( $temas, "numero" );
            
            for(var i = 0; i < $temas.length; i++){
                self.listaReproduccion.push({
                    playing: false,
                    indice: $temas[i].indice,
                    numero: $temas[i].numero,
                    nombre: $temas[i].nombre,
                    discoNombre: disco.nombre,
                    discoId: disco._id,
                    discoAno: disco.ano,
                    bandaNombre: self.banda.nombre,
                    bandaId: self.banda._id,
                    url: '/banda/' + self.banda._id + '/disco/' + disco._id + '/tema/' + $temas[i].indice + '/metadata'
                });
            }
        });
    };
    self.agregarTemaALista = function(index){
        var tema = self.disco.temas[index];

        self.listaReproduccion.push({
            playing: false,
            indice: tema.indice,
            numero: tema.numero,
            nombre: tema.nombre,
            discoNombre: self.disco.nombre,
            discoId: self.disco._id,
            discoAno: self.disco.ano,
            bandaNombre: self.disco.bandaNombre,
            bandaId: self.disco.bandaId,
            url: '/banda/' + self.disco.bandaId + '/disco/' + self.disco._id + '/tema/' + tema.indice + '/metadata'
        });
    };
    self.play = function(index){
        var tema = self.listaReproduccion[index];
        
        temaSrv.get({ bandaId: tema.bandaId, discoId: tema.discoId, indice: tema.indice, opcion: 'metadata' }, function($tema){
            self.info = $tema;
            var url = '/banda/' + tema.bandaId + '/disco/' + tema.discoId + '/tema/' + tema.indice + '/stream';
            var tocando = audio.play(url, $tema.contentType);
            
            TemaTerminado(indexTrack);

            if(tocando){
                tema.playing = true;
                indexTrack = index;
            }
            ActualizaEstado();
        });
    };
    self.playRightClick = function(){
        var tema = _.findWhere( self.listaReproduccion, { selected: true } );
        self.play( self.listaReproduccion.indexOf( tema ) );
        self.menuRightClick.show = false;
    };
    self.seleccionarTema = function(index){
        self.disco.temas.forEach(function(item){ item.selected = false; });
        self.disco.temas[index].selected = true;
    };
    self.select = function(index, $event){
        if($event.ctrlKey){
            self.listaReproduccion[index].selected = !self.listaReproduccion[index].selected;
        }else if($event.shiftKey){
            var index_1 = self.listaReproduccion.indexOf( _.findWhere( self.listaReproduccion, { selected: true } ) );
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
            TemaTerminado(indexTrack);
            self.play(indexTrack - 1);
        }
    };
    self.nextTrack = function(){
        if(self.listaReproduccion.length > (indexTrack + 1) && self.listaReproduccion[indexTrack + 1]){
            TemaTerminado(indexTrack);
            self.play(indexTrack + 1);
        }
    };
    self.stop = function(){
        audio.stop();
        ActualizaEstado();
    };
    self.togglePlayPause = function(){
        audio.togglePlayPause();
        ActualizaEstado();
    };
    self.mute = function(){
        self.muted = audio.toggleMute();
    };
    self.limpiarLista = function(){
        self.listaReproduccion = [];
    };
    self.mostrarInfo = function(){
        var tema = _.findWhere( self.listaReproduccion, { selected: true } );
        temaSrv.get({ bandaId: tema.bandaId, discoId: tema.discoId, indice: tema.indice, opcion: 'metadata' }, function($tema){
            self.metadata = $tema;
            self.mostrarMetadata = true;
        });
        self.menuRightClick.show = false;
    };
    self.hideMetadata = function(){ self.mostrarMetadata = false; };
    self.eliminarTema = function(){
        EliminarTemasSeleccionados();
        self.menuRightClick.show = false;
    };
    self.rightClickLista = function(index, $event){
        /*
        $event.ctrlKey = false;
        $event.shiftKey = false;
        self.select(index, $event);
        self.menuRightClick.left = $event.pageX;
        self.menuRightClick.top = $event.pageY;
        self.menuRightClick.show = true;
        */
    };
    self.ocultarInfo = function(){
        self.mostrarMetadata = false;
    };
    self.hideMsg = function(){
        self.msg = undefined;
    };
    self.onKeyDown = function ($event) {
        //46: delete
        if(46 == getKeyEventCode($event)){ EliminarTemasSeleccionados(); }
    };
    self.showInfoPopUp = function(){
        self.infoPopUp.show = true;
    };
    self.hideInfoPopUp = function(){
        self.infoPopUp.show = false;
    };
    
    audio.ended( function() { self.nextTrack(); });
    
    bandaSrv.getAll({}, function($result){
        self.bandas = $result;
    });

    function Vol(value){
        audio.setVolume( value );
        self.labelVolume = (value == volMin ? 'min' : (value == volMax ? 'max' : value));
    };
    function TemaTerminado(index){
        if(index > -1 && self.listaReproduccion[index]){
            var tema = self.listaReproduccion[index];
            tema.playing = false;
        }
    };
    function ActualizaEstado(){
        self.playing = audio.playing();
        self.paused = audio.paused();
        self.stoped = audio.stoped();
    }
    function EliminarTemasSeleccionados(){
        self.listaReproduccion = _.reject( self.listaReproduccion, function(tema){ return tema.selected; } );
    }
    jQuery(window).bind('resize', function(){ jQuery('div.container').css('height', (window.innerHeight - 80) + 'px'); });
    jQuery(window).trigger('resize');
}]);
