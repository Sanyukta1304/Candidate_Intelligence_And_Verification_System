const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const controller = require('../controllers/candidate.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/profile', verifyToken, controller.getProfile);
router.put('/profile', verifyToken, controller.updateProfile);

router.post('/github/verify', verifyToken, controller.verifyGithub);

router.post('/resume', verifyToken, upload.single('resume'), controller.uploadResume);

router.get('/resume-score', verifyToken, controller.getResumeScore);

module.exports = router;