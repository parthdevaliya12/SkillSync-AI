const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getStats, getProgress } = require('../controllers/dashboardController');

router.get('/stats', auth, getStats);
router.get('/progress', auth, getProgress);

module.exports = router;
