const express = require('express');
const router = express.Router();

const recruiterController = require('../controllers/recruiter.controller');
<<<<<<< HEAD
const { verifyToken } = require('../middleware/auth');

// ✅ TEST ROUTE
=======
const { verifyToken } = require('../middleware/auth'); // ✅ ADDED

// ✅ TEST ROUTE (unchanged)
>>>>>>> cf42a878e44737cf5323d658874f430fa0cae478
router.get('/test', (req, res) => {
  res.send("Recruiter API working ✅");
});

<<<<<<< HEAD
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
=======
// 🔍 Get candidates (search + filter)
router.get('/candidates', verifyToken, recruiterController.getCandidates); // ✅ UPDATED

// 👁️ View candidate (track view)
router.get('/candidates/:id', verifyToken, recruiterController.getCandidateById); // ✅ UPDATED

// ⭐ Star / Unstar
router.post('/star/:candidateId', verifyToken, recruiterController.starCandidate); // ✅ UPDATED
router.delete('/star/:candidateId', verifyToken, recruiterController.unstarCandidate); // ✅ UPDATED

// ⭐ Get starred list
router.get('/starred', verifyToken, recruiterController.getStarred); // ✅ UPDATED

// 📊 Dashboard stats
router.get('/stats', verifyToken, recruiterController.getStats); // ✅ UPDATED
>>>>>>> cf42a878e44737cf5323d658874f430fa0cae478

module.exports = router;