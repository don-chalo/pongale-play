'use strict';

angular.module("Recursos", ['ngResource'])
.factory('BandaSrv', ['$resource', function($resource){
    return $resource('/banda/:bandaid', { bandaid: '@bandaid' }, {
        query: { method: 'GET', params:{ }, isArray: true },
        get: { method: 'GET', params:{ }, isArray: false }
    });
}])
.factory('DiscoSrv', ['$resource', function($resource){
    return $resource('/disco/:discoid', { bandaid: '@bandaid', discoid: '@discoid' }, {
        query: { method: 'GET', params:{ }, isArray: true },
		get: { method: 'GET', params:{ }, isArray: false }
    });
}])
.factory('TemaSrv', ['$resource', function($resource){
    return $resource('/tema/:temaid/:opcion', { discoid: '@discoid', temaid: '@temaid', opcion: '@opcion' }, {
        query: { method: 'GET', params:{ }, isArray: true },
        get: { method: 'GET', params:{ }, isArray: false }
    });
}]);
