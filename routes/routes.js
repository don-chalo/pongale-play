var express = require('express');

module.exports = function(app){

    var BandaController = require('../controllers/BandaController'),
        DiscoController = require('../controllers/DiscoController'),
        TemaController = require('../controllers/TemaController'),
        ViewsController = require('../controllers/ViewsController');

    var bandaRouter,
        discoRouter,
        temaRouter,
        viewsRouter;
    
    
    /* BandaController */
    bandaRouter = express.Router();
    
    bandaRouter.route('/')
        .get(BandaController.find);
    
    bandaRouter.route('/:bandaid')
        .get(BandaController.findOne)
    
    app.use('/banda', bandaRouter);
    

    /* DiscoController */
    discoRouter = express.Router();
    
    discoRouter.route('/')
        .get(DiscoController.find);
    
    discoRouter.route('/:discoid')
        .get(DiscoController.findOne)
    
    app.use('/disco', discoRouter);
    

    /* TemaController */
    temaRouter = express.Router();
    
    temaRouter.route('/')
        .get(TemaController.find);
    
    temaRouter.route('/:temaid')
        .get(TemaController.findOne)
    
    temaRouter.route('/:temaid/metadata')
        .get(TemaController.getMetadata)
    
    temaRouter.route('/:temaid/stream')
        .get(TemaController.getStream)
    
    temaRouter.route('/:temaid/cover')
        .get(TemaController.getCover)
    
    app.use('/tema', temaRouter);
    

    /* ViewsController */
    viewsRouter = express.Router();
    
    viewsRouter.route('/')
        .get(ViewsController.index);
    
    viewsRouter.route('/help')
        .get(ViewsController.help)
    
    viewsRouter.route('/metadata')
        .get(ViewsController.metadata)

    viewsRouter.route('/range')
        .get(ViewsController.range)

    app.use('/', viewsRouter);
    
}