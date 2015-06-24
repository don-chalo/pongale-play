/*
 * Servicios orientados a compatir datos entre controllers y directivas.
 */

/* Servicio para metadata de tema seleccionado. */
function MetadataSrv(){
    var value;
    
    this.get = function(){ return value; };
    this.set = function(val){ value = val; };
}




angular.module("Servicios", []).factory("MetadataSrv", function(){ return new MetadataSrv(); });
