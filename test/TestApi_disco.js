var request = require('request');
var _ = require('underscore');
var should = require('should');

var url = "http://localhost:30010/disco";

//mocha -R spec

/* Si vows no está instalado global. */
//node mocha.js -R spec

describe('Servicio rest /disco,', function () {
    
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
    
    describe('Cuando realizo la petición /disco,', function(){
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
        it('cada elemento de response.body debe tener los atributos "nombre", "ano", "banda", "genero", "bandaid" y "_id"', function(){
            response.body.forEach(function(item){
                item.should.have.property("nombre");
                item.should.have.property("ano");
                item.should.have.property("banda");
                item.should.have.property("genero");
                item.should.have.property("bandaid");
                item.should.have.property("_id");
            });
        });
    });

    describe('Cuando realizo la petición /disco/:discoid,', function(){
        var response;
        var discoId;

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
        it('response.body no es un Array sino un Objecto con las atributos "nombre", "ano", "banda", "genero", "bandaid" y "_id"', function () {
            response.body.should.not.be.an.Array;
            response.body.should.be.an.Object;
            
            response.body.should.have.property("nombre");
            response.body.should.have.property("ano");
            response.body.should.have.property("banda");
            response.body.should.have.property("genero");
            response.body.should.have.property("bandaid");
            response.body.should.have.property("_id");

        });
    });
    
    describe("Cuando realizo la petición sobre /disco/:discoid sobre un disco que no existe,", function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '/123456789012345678901234',
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

    describe('Cuando realizo la query /disco?nombre=H,', function(){
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

    describe('Cuando realizo la query /disco?ano=2000,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?ano=2000',
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

    describe('Cuando realizo la query /disco?banda=Lite,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?banda=Lite',
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

    describe('Cuando realizo la query /disco?genero=Heavy,', function(){
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


    describe('Cuando realizo la query /disco?autor=Xalo,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?autor=Xalo',
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
        it('response.body es un Object con el atributo "message"', function () {
            response.body.should.be.an.Object;
            response.body.should.have.property('message');
        });
    });
});