const express = require('express');
const router = express.Router();

const recruiterController = require('../controllers/recruiter.controller');

// ✅ TEST ROUTE (ADD THIS)
router.get('/test', (req, res) => {
  res.send("Recruiter API working ✅");
});

// 🔍 Get candidates (search + filter)
router.get('/candidates', recruiterController.getCandidates);

// 👁️ View candidate (track view)
router.get('/candidates/:id', recruiterController.getCandidateById);

// ⭐ Star / Unstar
router.post('/star/:candidateId', recruiterController.starCandidate);
router.delete('/star/:candidateId', recruiterController.unstarCandidate);

// ⭐ Get starred list
router.get('/starred', recruiterController.getStarred);

// 📊 Dashboard stats
router.get('/stats', recruiterController.getStats);

module.exports = router;