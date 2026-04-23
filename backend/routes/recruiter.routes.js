const express = require('express');
const router = express.Router();

const recruiterController = require('../controllers/recruiter.controller');
const { verifyToken } = require('../middleware/auth'); // ✅ ADDED

// ✅ TEST ROUTE (unchanged)
router.get('/test', (req, res) => {
  res.send("Recruiter API working ✅");
});

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

module.exports = router;