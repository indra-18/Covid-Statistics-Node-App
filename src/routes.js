const controller = require('./controller')
const router = require('express').Router();

router.get('/totalRecovered', controller.totalRec)
router.get('/totalActive', controller.totalAct)
router.get('/totalDeath', controller.totalDeaths)
router.get('/hotspotStates', controller.hotspots)
router.get('/healthyStates', controller.healthy)

module.exports = router;