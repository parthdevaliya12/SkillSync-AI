const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chat, getHistory, clearHistory } = require('../controllers/aiController');

router.post('/chat', auth, chat);
router.get('/history', auth, getHistory);
router.delete('/history', auth, clearHistory);

module.exports = router;
