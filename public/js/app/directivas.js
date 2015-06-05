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
            /*
            $scope.$watch(
                function(scope){
                    console.log('generando caratula');
                    console.log(scope.metadata);
                }
            );
            */
        },
        templateUrl: 'metadata',
        replace: true
    };
}).directive('range', [function(){
    return {
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        scope: { current: '=current', max:"=max" },
        link: function($scope, element, attrs, ctrl){
            $scope.select = function($index, $event){
                
                $scope.values.forEach(function(item, i){
                    item.r = false;
                });
                for(var i = 0; i <= $index; i++){
                    $scope.values[ i ].r = true;
                }
                
                $scope.current = parseInt( $index );

                if(typeof $scope.$parent[attrs.handler] === 'function'){
                    $scope.$parent[attrs.handler]( $index, $event );
                }
            };
        },
        controller: function($scope){

            $scope.$watch(
                function(){
                    return $scope.max;
                },
                function(newValue, oldValue){
                    if(typeof newValue === 'undefined'){
                        $scope.values = [ { r: false } ];
                        $scope.width = '100%';
                    }else{
                        $scope.values = [];
                        for(var i = 0; i <= parseInt( newValue ); i++){
                            $scope.values.push( { r: false } );
                        }
                        $scope.width = ( 100 / $scope.values.length ) + '%';
                    }
                }
            );

            $scope.$watch(
                function(){
                    return $scope.current;
                },
                function(){
                    if(typeof $scope.current !== 'undefined'){
                        $scope.values[ parseInt( $scope.current ) ].r = true;
                    }
                }
            );
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
