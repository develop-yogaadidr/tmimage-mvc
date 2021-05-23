var express = require('express');
var router = express.Router();
const Scanner = require('../handler/controller/scanner'), Scan = new Scanner()

/* GET home page. */
router.get('/', Scan.index);
router.post('/scan', Scan.predict);

module.exports = router;
