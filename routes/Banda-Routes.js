var express = require('express');
var banda = require('./Banda');
var router = express.Router();


router.get('/', banda["get /"]);

router.get('/:id', banda["get /:id"]);

router.get('/:id/disco', banda["get /:id/disco"]);

router.get('/:bandaid/disco/:discoid', banda["get /:bandaid/disco/:discoid"]);

router.get('/:bandaid/disco/:discoid/tema', banda["get /:bandaid/disco/:discoid/tema"]);

router.get('/:bandaid/disco/:discoid/tema/:indice', banda["get /:bandaid/disco/:discoid/tema/:indice"]);

router.get('/:bandaid/disco/:discoid/tema/:indice/metadata', banda["get /:bandaid/disco/:discoid/tema/:indice/metadata"]);

router.get('/:bandaid/disco/:discoid/tema/:indice/stream', banda["get /:bandaid/disco/:discoid/tema/:indice/stream"]);

router.get('/:bandaid/disco/:discoid/tema/:indice/cover', banda["get /:bandaid/disco/:discoid/tema/:indice/cover"]);

module.exports = router;
