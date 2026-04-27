const express = require('express');
const router = express.Router();

const recruiterController = require('../controllers/recruiter.controller');
const { verifyToken } = require('../middleware/auth');

// ✅ TEST ROUTE
router.get('/test', (req, res) => {
  res.send("Recruiter API working ✅");
});

// ========================================
// 👤 PROFILE ROUTES (PROTECTED)
// ========================================
router.get('/profile', verifyToken, recruiterController.getProfile);
router.put('/profile', verifyToken, recruiterController.updateProfile);

// ========================================
// 🔍 CANDIDATE SEARCH & VIEW (PROTECTED)
// ========================================
router.get('/candidates', verifyToken, recruiterController.getCandidates);
router.get('/candidates/:id', verifyToken, recruiterController.getCandidateById);

// ========================================
// ⭐ STAR / UNSTAR (PROTECTED)
// ========================================
router.post('/star/:candidateId', verifyToken, recruiterController.starCandidate);
router.delete('/star/:candidateId', verifyToken, recruiterController.unstarCandidate);

// ========================================
// 📊 DASHBOARD (PROTECTED)
// ========================================
router.get('/starred', verifyToken, recruiterController.getStarred);
router.get('/stats', verifyToken, recruiterController.getStats);
router.get('/activity', verifyToken, recruiterController.getActivity);

module.exports = router;