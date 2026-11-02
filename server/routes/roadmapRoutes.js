const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateRoadmap, getRoadmaps, getRoadmapById, updateTask, deleteRoadmap } = require('../controllers/roadmapController');

router.post('/generate', auth, generateRoadmap);
router.get('/', auth, getRoadmaps);
router.get('/:id', auth, getRoadmapById);
router.delete('/:id', auth, deleteRoadmap);

// Task routes (nested under roadmaps for convenience)
router.put('/tasks/:id', auth, updateTask);

module.exports = router;
