const express = require('express')
const router = express.Router();
const {Infocontroller} = require('../../controllers')

router.get('/info',Infocontroller.info)

module.exports = router;  