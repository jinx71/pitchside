const express = require('express');
const ctrl = require('../controllers/footballController');

const router = express.Router();

router.get('/competitions', ctrl.competitions);
router.get('/matches/live', ctrl.live);
router.get('/matches/today', ctrl.today);
router.get('/competitions/:code/matches', ctrl.competitionMatches);
router.get('/competitions/:code/standings', ctrl.standings);
router.get('/teams/:compCode/:teamId', ctrl.team);
router.get('/debug/cache', ctrl.debug);

module.exports = router;
