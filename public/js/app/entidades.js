'use strict';

var entities = angular.module('Entidades', []);

entities.factory('audio', ['$document', function($document){
    var audio = $document[0].createElement('audio');
    var vol = 10;
    var isPlaying = false;
    var isPaused = false;
    var isStoped = false;
    
    function playing(){ isPlaying = true; isPaused = false; isStoped = false };
    function stoped(){ isPlaying = false; isPaused = false; isStoped = true };
    function paused(){ isPlaying = false; isPaused = true; isStoped = false };
    
    stoped();
    
    return {
        playing: function(){ return isPlaying; },
        paused: function(){ return isPaused; },
        stoped: function(){ return isStoped; },
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
        stop: function(){
            if(isPlaying){
                audio.currentTime = 0;
                audio.pause();
                stoped();
            }
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
            vol = value > 10 ? 10 : (value < 0 ? 0 : value);
            audio.volume = vol / 10;
            return vol;
        },
        addVolume: function(){
            return this.setVolume(vol + 1);
        },
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
        error: function(cb){
            audio.addEventListener('error', function(err){
                cb(err);
            });
        }
    };
}]);
