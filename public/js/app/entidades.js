'use strict';

var entities = angular.module('Entidades', ['ngCookies']);

entities.factory('audio', ['$document', function($document){
    var audio = $document[0].createElement('audio');
    var isPlaying = false;
    var isPaused = false;
    var state = '';
    var vol = 10;
    var volMax = 100;
    var volMin = 0;
    
    function playing(){ isPlaying = true; isPaused = false; state = 'playing'; };
    function paused(){ isPlaying = false; isPaused = true; state = 'paused'; };
    
    return {
        playing: function(){ return isPlaying; },
        paused: function(){ return isPaused; },
        getState: function(){ return state; },
        play: function(filename, type) {
            audio.src = filename;
            audio.type = type;
            if(!audio.muted){ audio.play(); playing(); }
            return isPlaying;
        },
        pause: function(){
            audio.pause();
            paused();
            return isPlaying;
        },
        togglePlayPause: function(){
            if(isPlaying){
                audio.pause();
                paused();
            }else{
                audio.play();
                playing();
            }
            return isPlaying;
        },
        setVolume: function(value){
            value = parseInt(value);
            vol = value > volMax ? volMax : (value < volMin ? volMin : value);
            audio.volume = parseFloat( vol / volMax );
            return vol;
        },
        addVolume: function(){
            return this.setVolume(vol + 1);
        },
        getVolumeMin: function(){ return volMin; },
        getVolumeMax: function(){ return volMax; },
        restVolume: function(){
            return this.setVolume(vol - 1);
        },
        toggleMute: function(){
            audio.muted = !audio.muted;
            return audio.muted;
        },
        getDuration: function(){ return audio.duration; },
        setDuration: function(duration){ audio.duration = duration; },
        getCurrentTime: function(){ return audio.currentTime; },
        setCurrentTime: function(currentTime){ audio.currentTime = currentTime; },
        ended: function(fc){
            audio.addEventListener('ended', fc);
        },
        timeupdate: function(fc){
            audio.addEventListener('timeupdate', function(ev){
                fc(audio.duration, audio.currentTime);
            });
        },
        error: function(fc){
            audio.addEventListener('error', function(err){
                fc(err);
            });
        }
    };
}])
.factory('listaReproduccion', function(){
    
    /*
     * La idea de esta entidad es que esté integrado con con un almacenamiento más permanente para la lista de reproducción.
     */
    
    var listaReproduccion = new Array();
    
    if(typeof Storage === 'undefined'){

        listaReproduccion.addItem = function(item){
            this.push(item);
        };

        listaReproduccion.setArray = function(array){
            var self = this;
            self.removeAll();
            array.forEach(function(item, index){ self.push( item ); });
        };

        listaReproduccion.removeAll = function(){ this.length = 0; };
    }else{
        listaReproduccion.addItem = function(item){
            this.push( item );
            localStorage.listaReproduccion = angular.toJson( this );
        }
        listaReproduccion.setArray = function(_array){
            var self = this;
            self.removeAll();
            _array.forEach(function(item){ self.addItem( item ); });
        }
        listaReproduccion.removeAll = function(){ this.length = 0; localStorage.listaReproduccion = angular.toJson( [] ); }
        
        if(typeof localStorage.listaReproduccion === 'undefined'){
            listaReproduccion.removeAll();
        }

        var _array = angular.fromJson( localStorage.listaReproduccion );
        listaReproduccion.setArray( _array );
    }
    
    return listaReproduccion;
});
