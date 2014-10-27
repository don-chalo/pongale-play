var request = require('request');
var _ = require('underscore');
var should = require('should');
var banda = require('../routes/Banda');

//mocha -R spec

/* Si mocha no está instalado global. */
//node mocha.js -R spec

describe('Test Banda routes', function () {
    
    before(function(){  });
    after(function(){  });
    beforeEach(function(){  });
    afterEach(function(){  });
    
    describe('get /', function(){
        
        var result = undefined;
        
        before(function(done){
            var req = {};
            var res = {
                json: function(obj){
                    result = obj;
                    done();
                }
            };
            banda['get /'](req, res);
        });
    
        it('no es null ni undefined', function () {
            should.exist(result);
        });
        it('es un Array', function(){
            result.should.be.an.Array;
        });
    });
    
    describe('get /:id', function(){
        
        var result = undefined;
        
        before(function(done){
            var req = {};
            var res = {
                json: function(obj){
                    var item = obj[0];
                    
                    banda["get /:id"](
                        {
                            params:{
                                id: item._id
                            }
                        },
                        {
                            json: function(obj){
                                result = obj
                                done();
                            }
                        }
                    );
                }
            };
            banda['get /'](req, res);
        });
    
        it('no es null ni undefined', function () {
            should.exist(result);
        });
        it('es un objeto', function(){
            result.should.be.an.Object;
        });
        it('tiene atributo \"nombre\", \"_id\" y \"genero\"', function(){
            result.should.have.property('nombre');
            result.should.have.property('_id');
            result.should.have.property('genero');
        });
    });
    
    
    describe('get /:id/disco', function(){
        
        var result = undefined;
        
        before(function(done){
            var req = {};
            var res = {
                json: function(obj){
                    var item = obj[0];
                    
                    banda["get /:id/disco"](
                        {
                            params:{
                                id: item._id
                            }
                        },
                        {
                            json: function(obj){
                                result = obj
                                done();
                            }
                        }
                    );
                }
            };
            banda['get /'](req, res);
        });
    
        it('no es null ni undefined', function () {
            should.exist(result);
        });
        it('es un array', function(){
            result.should.be.an.Array;
        });
        it('los elementos tienen los atributos nombre, ano y id ', function(){
            result.forEach(function(item, index){
                item.should.have.property('nombre');
                item.should.have.property('ano');
                item.should.have.property('_id');
            });
        });
    });
});

/*
banda["get /:bandaid/disco/:discoid"]
banda["get /:bandaid/disco/:discoid/tema"]
banda["get /:bandaid/disco/:discoid/tema/:numero"]
banda["get /:bandaid/disco/:discoid/tema/:numero/stream"]
banda["get /:bandaid/disco/:discoid/tema/:numero/cover"]
*/
