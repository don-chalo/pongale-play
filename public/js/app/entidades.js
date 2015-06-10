'use strict';

var entities = angular.module('Entidades', ['ngCookies']);

entities.factory('audio', ['$document', function($document){
    var audio = $document[0].createElement('audio');
    var isPlaying = false;
    var isPaused = false;
    var state = '';
    var vol = 0;
    var volMax = 100;
    var volMin = 0;
    
    if(typeof Storage === 'undefined'){
        var setPersistVol = function(vol){};
        var getPersistVol = function(){ return vol; };
    }else{
        var setPersistVol = function(vol){ window.localStorage.volume = vol; };
        var getPersistVol = function(){
            if(typeof window.localStorage.volume === 'undefined') window.localStorage.volume = 0;
            return parseInt( window.localStorage.volume );
        };
    }
    
    function playing(){ isPlaying = true; isPaused = false; state = 'playing'; };
    function paused(){ isPlaying = false; isPaused = true; state = 'paused'; };
    function stoped(){ isPlaying = false; isPaused = false; state = 'stoped'; };
    
    return {
        playing: function(){ return isPlaying; },
        paused: function(){ return isPaused; },
        stoped: function(){ return !isPaused && !isPlaying; },
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
            setPersistVol( vol );
            return vol;
        },
        getVolume: function(){
            return getPersistVol();
        },
        getVolumeMax: function(){ return volMax; },
        toggleMute: function(){
            audio.muted = !audio.muted;
            return audio.muted;
        },
        getDuration: function(){ return audio.duration; },
        getCurrentTime: function(){ return audio.currentTime; },
        setCurrentTime: function(currentTime){
            currentTime = parseInt( currentTime );
            //Con este "if" permitimos la existencia de solo un "TimeRanges" en objeto "buffered".
            if(audio.buffered.length > 0 && audio.buffered.start(0) <= currentTime && audio.buffered.end(0) >= currentTime){
                audio.currentTime = currentTime;
            }
        },
        ended: function(fc){
            audio.addEventListener('ended', fc);
            stoped();
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
            window.localStorage.listaReproduccion = angular.toJson( this );
        }
        listaReproduccion.setArray = function(_array){
            var self = this;
            self.removeAll();
            _array.forEach(function(item){ self.addItem( item ); });
        }
        listaReproduccion.removeAll = function(){ this.length = 0; window.localStorage.listaReproduccion = angular.toJson( [] ); }
        
        if(typeof window.localStorage.listaReproduccion === 'undefined'){
            listaReproduccion.removeAll();
        }

        var _array = angular.fromJson( window.localStorage.listaReproduccion );
        _array.forEach(function(item){ item.playing = false; });
        listaReproduccion.setArray( _array );
    }
    
    return listaReproduccion;
});
