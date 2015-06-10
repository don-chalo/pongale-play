'use strict';

angular.module('Librerias', [])
    .factory('formatearSegundos', function(){
        return function(segundos){
                if(segundos){
                    var horas = parseInt(segundos / 3600);
                    segundos = segundos - (horas * 3600);

                    var minutos  = parseInt( segundos / 60 );
                    segundos = parseInt(segundos - (minutos * 60));

                    minutos = minutos < 10 ? "0" + minutos : minutos;
                    segundos = segundos < 10 ? "0" + segundos : segundos;
                    
                    return { horas: horas.toString(), minutos: minutos.toString(), segundos: segundos.toString() };
                }
        };
    }).factory('getKeyEventCode', function(){
        return function(keyEvent){
            return window.event ? keyEvent.keyCode : keyEvent.which;
        };
    });
