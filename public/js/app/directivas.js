'use strict';

angular.module('Directivas', ['Servicios'])
.directive('metadataTema', ["MetadataSrv", function(metadataSrv){
    
    function MetadataCtrl(){ }
    
    Object.defineProperty(MetadataCtrl.prototype, "metadata", {
        enumerable: true,
        configurable: false,
        get: function(){ return metadataSrv.get() }
    });
    
    return {
        controller: MetadataCtrl,
        controllerAs: "metadataCtrl",
        link: function($scope, element, attrs, ctrl){
            $scope.hide = function(){ $scope.show = false; };
        },
        scope: { show: '=' },
        replace: true,
        restrict: 'E',
        templateUrl: '/metadata',
        transclude: false
    };
}]).directive('range', [function(){
    
    function RangeCtrl(){
        this.mostrar = false;
        this.valor = "";
        this.values = [];
        this.width = "100%";
    };
    RangeCtrl.prototype._format = function(){ return ""; };
    RangeCtrl.prototype.ocultarTooltip = function( $event ){ this.mostrar = false; };
    RangeCtrl.prototype.mostrarTooltip = function( $event, bloque ){
        if(bloque){
            this.valor = this._format( bloque );
            this.mostrar = true;
        }
    };
    RangeCtrl.prototype.select = function(){};
    
    return {
        controller: RangeCtrl,
        controllerAs: "rangeCtrl",
        link: function($scope, element, attrs, ctrl){
            ctrl.select = $scope.$parent[attrs.handler];
            
            /* Tooltip habilitado solo si el atributo tiene un valor. */
            if(typeof attrs.formatearTooltip !== "undefined"){
                ctrl._format = typeof $scope.$parent[attrs.formatearTooltip] === "function" ? $scope.$parent[attrs.formatearTooltip] : function(_v){ return _v; };
            }
            
            $scope.$watch("rangeAttrs.max",
                function(newValue, oldValue){
                    if(typeof newValue === 'undefined'){
                        ctrl.values = [ { r: false } ];
                        ctrl.width = '100%';
                    }else{
                        ctrl.values = [];
                        for(var i = 0; i <= parseInt( newValue ); i++){
                            ctrl.values.push( { r: false, bloque: i } );
                        }
                        ctrl.width = ( 100 / ctrl.values.length ) + '%';
                    }
                }
            );
        },
        replace: true,
        restrict: 'E',
        scope: { rangeAttrs: "=" },
        templateUrl: '/range',
        transclude: false
    };
}]);
