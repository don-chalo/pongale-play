var request = require('request');
var _ = require('underscore');
var should = require('should');

//mocha -R spec

/* Si vows no está instalado global. */
//node mocha.js -R spec

describe('Test api rest,', function () {
    
    describe('/banda,', function(){
        var response;

        before(function(done){
            request
                .get({
                        json: true,
                        url: 'http://localhost:3000/banda',
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
});