const mongoose = require('mongoose');

// Member Schema
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    branch: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true, enum: ['MALE', 'FEMALE', 'OTHERS'] }
});

// Main Registration Schema
const registrationSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true, uppercase: true },
    teamLeadMobile: { type: String, required: true },
    
    // Members 1-6
    member1: { type: memberSchema, required: true },
    member2: { type: memberSchema, required: true },
    member3: { type: memberSchema, required: true },
    member4: { type: memberSchema, required: true },
    member5: { type: memberSchema, required: true },
    member6: { type: memberSchema, required: true },
    
    problemStatement: { type: String, required: true },
    solutionExplanation: { type: String, required: true },
    termsAccepted: { type: Boolean, required: true, default: false },
    
    registrationId: { type: String, unique: true },
    registrationDate: { type: Date, default: Date.now }
});

// REMOVED the problematic pre-save hook completely

module.exports = mongoose.model('Registration', registrationSchema);