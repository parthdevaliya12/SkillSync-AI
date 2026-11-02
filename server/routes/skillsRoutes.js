const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllSkills, getUserSkills, addUserSkill, updateUserSkill, deleteUserSkill } = require('../controllers/skillsController');

router.get('/', getAllSkills);
router.get('/user', auth, getUserSkills);
router.post('/user', auth, addUserSkill);
router.put('/user/:id', auth, updateUserSkill);
router.delete('/user/:id', auth, deleteUserSkill);

module.exports = router;
