'use strict';

angular.module('Componentes', ['Entidades', 'Librerias', 'BibliotecaSrv'])
.directive('metadataTema', function(){
    return {
        restrict: 'E',
        transclude: true,
        controllerAs: 'metadataCtrl',
        scope: { mostrarMetadata: '=show', metadata: '=value' },
        link: function($scope, element, attrs, ctrl){
            ctrl.hideMetadata = function(){
                $scope.mostrarMetadata = false;
            };
        },
        controller: function($scope){
        },
        templateUrl: 'metadata',
        replace: true
    };
}).directive('range', [function(){
    return {
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        scope: { max:"=max", current: '=current' },
        link: function($scope, element, attrs, ctrl){
            $scope.select = function($index, $event){
                if(typeof $scope.$parent[attrs.handler] === 'function'){
                    $scope.$parent[attrs.handler]( $index, $event );
                }
            };
            
            /* Tooltip habilitado solo si el atributo tiene un valor. */
            if(typeof attrs.formatearTooltip !== "undefined"){
                var _format = typeof $scope.$parent[attrs.formatearTooltip] === "function" ? $scope.$parent[attrs.formatearTooltip] : function(_v){ return _v; };
            
                $scope.mostrarTooltip = function( $event, bloque ){
                    if(bloque){
                        var obj = _format( bloque )
                        $scope.valor = (obj.horas === "0" ? '': obj.horas + ":") + obj.minutos + ":" + obj.segundos;
                        $scope.mostrar = true;
                    }
                }
                $scope.ocultarTooltip = function( $event ){
                    $scope.mostrar = false;
                }
            }
        },
        controller: function($scope){
            $scope.$watch("max",
                function(newValue, oldValue){
                    if(typeof newValue === 'undefined'){
                        $scope.values = [ { r: false } ];
                        $scope.width = '100%';
                    }else{
                        $scope.values = [];
                        for(var i = 0; i <= parseInt( newValue ); i++){
                            $scope.values.push( { r: false, bloque: i } );
                        }
                        $scope.width = ( 100 / $scope.values.length ) + '%';
                    }
                }
            );
            
            $scope.$watch("current",
                function(newValue, oldValue){
                    if(typeof oldValue !== 'undefined' && typeof $scope.values[ oldValue ] !== 'undefined'){
                        $scope.values[ oldValue ].r = false;
                    }
                    if(typeof newValue !== 'undefined' && typeof $scope.values[ newValue ] !== 'undefined'){
                        $scope.values[ newValue ].r = true;
                    }
                });
        },
        templateUrl: 'range',
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
