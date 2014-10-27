'use strict';

angular.module('Librerias', [])
    .factory('formatearSegundos', function(){
        return function(segundos){
                if(segundos){
                    var horas = parseInt(segundos / 3600);
                    segundos = segundos - (horas * 3600);

                    var minutos  = parseInt( segundos / 60 );
                    segundos = segundos - (minutos * 60);

                    return { horas: horas, minutos: minutos, segundos: parseInt(segundos) };
                }
        };
    }).factory('getKeyEventCode', function(){
        return function(keyEvent){
            return window.event ? keyEvent.keyCode : keyEvent.which;
        };
    });
