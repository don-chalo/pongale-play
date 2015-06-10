var request = require('request');
var _ = require('underscore');
var should = require('should');

var url = "http://localhost:30010/banda";

//mocha -R spec

/* Si vows no está instalado global. */
//node mocha.js -R spec

describe('Servicio rest /banda,', function () {
    
    var server;
    
    before(function(done){
        var app = require('../app');
        
        app.set('port', 30010);
        
        server = app.listen(app.get('port'), function(){
            console.log('App corriendo...');
            done();
        });
    });
    
    after(function(){
        server.close();
    });
    
    describe('Cuando realizo la petición /banda,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url,
                        timeout: 60000
                    },
                    function (_err, _response, _body) {
                        response = _response;
                        done();
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 200', function () {
            response.statusCode.should.be.equal(200);
        });
        it('response.body es un array', function () {
            response.body.should.be.an.Array;
        });
        it('cada elemento del response debe tener los atributos "nombre", "genero" y "_id"', function(){
            response.body.forEach(function(item){
                item.should.have.property('nombre');
                item.should.have.property('genero');
                item.should.have.property('_id');
            });
        });
    });

    describe('Cuando realizo la petición /banda/:bandaid,', function(){
        var response;
        var bandaid;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url,
                        timeout: 60000
                    },
                    function (_err, _response, _body) {
                        request
                            .get({
                                    json: true,
                                    url: url + '/' + _response.body[0]._id,
                                    timeout: 60000
                                },
                                function (_err, _response2, _body) {
                                    response = _response2;
                                    done();
                                }
                            );
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 200', function () {
            response.statusCode.should.be.equal(200);
        });
        it('response.body no es un Array sino un Objecto', function () {
            response.body.should.not.be.an.Array;
            response.body.should.be.an.Object;
        });
        it('response.body debe tener los atributos "nombre", "genero" y "_id"', function(){
            response.body.should.have.property('nombre');
            response.body.should.have.property('genero');
            response.body.should.have.property('_id');
        });
    });
    
    describe("Cuando realizo la petición sobre /banda/:bandaid sobre una banda que no existe,", function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '/1234567890123456',
                        timeout: 60000
                    },
                    function (_err, _response2, _body) {
                        response = _response2;
                        done();
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 404', function () {
            response.statusCode.should.be.equal(404);
        });
    });

    describe('Cuando realizo la query /banda?genero=Heavy,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?genero=Heavy',
                        timeout: 60000
                    },
                    function (_err, _response, _body) {
                        response = _response;
                        done();
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 200', function () {
            response.statusCode.should.be.equal(200);
        });
        it('response.body es un array', function () {
            response.body.should.be.an.Array;
        });
    });

    describe('Cuando realizo la query /banda?nombre=H,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?nombre=H',
                        timeout: 60000
                    },
                    function (_err, _response, _body) {
                        response = _response;
                        done();
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 200', function () {
            response.statusCode.should.be.equal(200);
        });
        it('response.body es un array', function () {
            response.body.should.be.an.Array;
        });
    });

    describe('Cuando realizo la query /banda?bandaid=0475,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?bandaid=0475',
                        timeout: 60000
                    },
                    function (_err, _response, _body) {
                        response = _response;
                        done();
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 400', function () {
            response.statusCode.should.be.equal(400);
        });
        it('response.body es un Object', function () {
            response.body.should.be.an.Object;
        });
    });

    describe('Cuando realizo la query /banda?disco=Play,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?disco=Play',
                        timeout: 60000
                    },
                    function (_err, _response, _body) {
                        response = _response;
                        done();
                    }
                );
        });

        after(function(){  });
        beforeEach(function(){  });
        afterEach(function(){  });

        it('response no es null', function () {
            should.exist(response);
        });
        it('response.status es un 400', function () {
            response.statusCode.should.be.equal(400);
        });
        it('response.body es un Object', function () {
            response.body.should.be.an.Object;
        });
    });
});