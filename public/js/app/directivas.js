'use strict';

angular.module('Componentes', ['Entidades', 'Librerias']).directive('metadataTema', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: { mostrarMetadata: '=show', metadata: '=value' },
        link: function($scope, element, attrs, ctrl){
        },
        controller: function($scope){
            /*
            $scope.$watch(
                function(scope){
                    console.log('generando caratula');
                    console.log(scope.metadata);
                }
            );
            */
        },
        template: jQuery('script#metadata').html(),
        replace: true
    };
}).directive('trackInfo', ['audio', 'formatearSegundos', function(audio, FormatearSegundos){
    return {
        restrict: 'E',
        transclude: true,
        scope: { info: '=track' },
        link: function($scope, element, attrs, ctrl){
        },
        controller: function($scope){
            $scope.buscando = function(){
                audio.setCurrentTime( $scope.rangeCurrentTime );
            };
            
            audio.timeupdate( function(duration, currentTime) {
                $scope.$apply(function() {
                    if(duration){
                        $scope.duration = FormatearSegundos(duration);
                        $scope.rangeDuration = duration;
                    }
                    if(currentTime){
                        $scope.currentTime = FormatearSegundos(currentTime);
                        $scope.rangeCurrentTime = currentTime;
                    }
                });
            });
        },
        template: jQuery('script#info').html(),
        replace: true
    };
}]).directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
