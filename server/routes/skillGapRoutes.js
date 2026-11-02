const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { calculateSkillGap, getSkillGap } = require('../controllers/skillGapController');

router.post('/:jobId', auth, calculateSkillGap);
router.get('/:jobId', auth, getSkillGap);

module.exports = router;
