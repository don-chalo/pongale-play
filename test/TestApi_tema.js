var request = require('request');
var _ = require('underscore');
var should = require('should');

var url = "http://localhost:30010/tema";

//mocha -R spec

/* Si vows no está instalado global. */
//node mocha.js -R spec

describe('Servicio rest /tema,', function () {
    
    this.timeout(6000);
    
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
    
    describe('Cuando realizo la petición sobre /tema,', function(){
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
    });

    describe('Cuando realizo la petición sobre /tema/:temaid,', function(){
        var response;
        var temaId;

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
    });
    
    describe("Cuando realizo la petición sobre /tema/:temaid sobre un tema que no existe,", function(){
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

    describe('Cuando realizo la petición sobre /tema/:temaid/metadata,', function(){
        var response;

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
                                    url: url + '/' + _response.body[0]._id + '/metadata',
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
        it('response.body no es un Array sino un Object', function () {
            response.body.should.not.be.an.Array;
            response.body.should.be.an.Object;
        });
    });
    
    describe("Cuando realizo la petición sobre /tema/:temaid/metadata sobre un tema que no existe,", function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '/123456789012345678901234/metadata',
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

    describe('Cuando realizo la query /tema?nombre=H,', function(){
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

    describe('Cuando realizo la query /tema?numero=15,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?numero=15',
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

    describe('Cuando realizo la query /tema?banda=Lite,', function(){
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

    describe('Cuando realizo la query /tema?genero=Heavy,', function(){
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

    describe('Cuando realizo la query /tema?bandaid=49,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?bandaid=49',
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

    describe('Cuando realizo la query /tema?disco=The,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?disco=The',
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
            response.statusCode.should.be.equal(200);
        });
        it('response.body es un Array', function () {
            response.body.should.be.an.Array;
        });
    });

    describe('Cuando realizo la query /tema?ano=2014,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?ano=2014',
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
            response.statusCode.should.be.equal(200);
        });
        it('response.body es un Array', function () {
            response.body.should.be.an.Array;
        });
    });

    describe('Cuando realizo la query /tema?discoid=89,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: url + '?discoid=89',
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

    describe('Cuando realizo la query /tema?autor=Xalo,', function(){
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
        it('response.body es un Objeto con el atributo "message"', function () {
            response.body.should.be.an.Object;
            response.body.should.have.property('message');
        });
    });
});