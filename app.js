var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

var config = require('./config/scan.json');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache', 'production' === process.env.NODE_ENV);

app.use(favicon());
app.use(morgan( 'production' === process.env.NODE_ENV ? 'tiny' : 'dev' ));
app.set('x-powered-by', !('production' === process.env.NODE_ENV));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/* (+) Inicializa la aplicación, leyendo los modulos existentes en la carpeta bootstrap */
var _modules = fs.readdirSync('./bootstrap/');
var _module = undefined;

_modules.forEach(function(item){
    _fc = require('./bootstrap/' + item);
    
    if(typeof _fc === 'function'){
        _fc();
    }
});
/* (-) */

//Configura las rutas.
require('./routes/routes')(app);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

process.on('uncaughtException', function(err){
    console.error(err.stack);
    console.error(err.message);
    process.exit(1);
});

process.on('SIGINT', function(){
    server.close();
    process.exit(1);
});

process.on('error', function(){
    console.log('no se pudo terminar correctamente el proceso.');
});


app.set('port', process.env.PORT || 30010);

if(require.main === module){
    
    var server = app.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
    
}else{
    console.info('Running app as a module');
    
    module.exports = app;
}
