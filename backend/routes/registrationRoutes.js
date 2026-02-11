// routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const { registerTeam, getAllRegistrations } = require('../controllers/registrationController');

// Public route - Register team
router.post('/register', registerTeam);

// Public route - Get all registrations (for testing)
router.get('/registrations', getAllRegistrations);

module.exports = router;