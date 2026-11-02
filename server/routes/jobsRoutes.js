const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { analyzeJob, getJobs, getJobById, deleteJob } = require('../controllers/jobsController');

router.post('/analyze', auth, upload.single('pdf'), analyzeJob);
router.get('/', auth, getJobs);
router.get('/:id', auth, getJobById);
router.delete('/:id', auth, deleteJob);

module.exports = router;
