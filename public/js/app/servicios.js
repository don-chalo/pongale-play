'use strict';

var BibliotecaSrv = angular.module('BibliotecaSrv', ['ngResource']);

BibliotecaSrv.factory('BandaSrv', ['$resource',
    function($resource){
		return $resource('/banda/:id', { id: '@id' }, {
			getAll: { method: 'GET', params:{ }, isArray: true, cache: true },
			get: { method: 'GET', params:{ }, isArray: false, cache: true }
		});
    }
]);

BibliotecaSrv.factory('DiscoSrv', ['$resource',
    function($resource){
		return $resource('/banda/:bandaId/disco/:discoId', { bandaId: '@bandaId', discoId: '@discoId' }, {
			getAll: { method: 'GET', params:{ }, isArray: true, cache: true },
			get: { method: 'GET', params:{ }, isArray: false, cache: true }
		});
    }
]);

BibliotecaSrv.factory('TemaSrv', ['$resource',
    function($resource){
		return $resource('/banda/:bandaId/disco/:discoId/tema/:indice/:opcion', { bandaId: '@bandaId', discoId: '@discoId', indice: '@indice', opcion: '@opcion' }, {
			getAll: { method: 'GET', params:{ }, isArray: true, cache: true },
			get: { method: 'GET', params:{ }, isArray: false, cache: true }
		});
    }
]);
