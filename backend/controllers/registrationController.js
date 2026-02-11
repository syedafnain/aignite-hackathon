
// const Registration = require('../models/Registration');
// exports.registerTeam = async (req, res) => {
//     try {
//         console.log('📥 Registration request received');
        
//         const {
//             teamName, teamLeadMobile,
//             member1Name, member1Roll, member1Branch, member1Email, member1Gender,
//             member2Name, member2Roll, member2Branch, member2Email, member2Gender,
//             member3Name, member3Roll, member3Branch, member3Email, member3Gender,
//             member4Name, member4Roll, member4Branch, member4Email, member4Gender,
//             member5Name, member5Roll, member5Branch, member5Email, member5Gender,
//             member6Name, member6Roll, member6Branch, member6Email, member6Gender,
//             problemStatement, solutionExplanation, terms
//         } = req.body;

        
//         const existingTeam = await Registration.findOne({ teamName: teamName.toUpperCase() });
//         if (existingTeam) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Team name already exists. Please choose a different name.'
//             });
//         }

     
//         const genders = [member1Gender, member2Gender, member3Gender, member4Gender, member5Gender, member6Gender];
//         if (!genders.includes('FEMALE')) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Team must have at least one female member'
//             });
//         }

        
//         const member1 = { name: member1Name, rollNumber: member1Roll, branch: member1Branch, email: member1Email, gender: member1Gender };
//         const member2 = { name: member2Name, rollNumber: member2Roll, branch: member2Branch, email: member2Email, gender: member2Gender };
//         const member3 = { name: member3Name, rollNumber: member3Roll, branch: member3Branch, email: member3Email, gender: member3Gender };
//         const member4 = { name: member4Name, rollNumber: member4Roll, branch: member4Branch, email: member4Email, gender: member4Gender };
//         const member5 = { name: member5Name, rollNumber: member5Roll, branch: member5Branch, email: member5Email, gender: member5Gender };
//         const member6 = { name: member6Name, rollNumber: member6Roll, branch: member6Branch, email: member6Email, gender: member6Gender };

      
//         const registration = await Registration.create({
//             teamName: teamName.toUpperCase(),
//             teamLeadMobile,
//             member1, member2, member3, member4, member5, member6,
//             problemStatement,
//             solutionExplanation,
//             termsAccepted: terms === 'on'
//         });

//         console.log(`✅ Team registered: ${registration.teamName} (ID: ${registration.registrationId})`);

//         res.status(201).json({
//             success: true,
//             message: 'Team registered successfully!',
//             data: {
//                 registrationId: registration.registrationId,
//                 teamName: registration.teamName
//             }
//         });

//     } catch (error) {
//         console.error('❌ Registration error:', error);
        
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Team name already exists. Please choose a different name.'
//             });
//         }
        
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(val => val.message);
//             return res.status(400).json({
//                 success: false,
//                 message: messages.join(', ')
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: 'Registration failed. Please try again.'
//         });
//     }
// };

// exports.getAllRegistrations = async (req, res) => {
//     try {
//         const registrations = await Registration.find().sort({ registrationDate: -1 });
//         res.status(200).json({
//             success: true,
//             count: registrations.length,
//             data: registrations
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching registrations'
//         });
//     }
// };


const Registration = require('../models/Registration');

// @desc    Register new team
// @route   POST /api/register
exports.registerTeam = async (req, res) => {
    try {
        console.log('📥 Registration request received');
        
        const {
            teamName, teamLeadMobile,
            member1Name, member1Roll, member1Branch, member1Email, member1Gender,
            member2Name, member2Roll, member2Branch, member2Email, member2Gender,
            member3Name, member3Roll, member3Branch, member3Email, member3Gender,
            member4Name, member4Roll, member4Branch, member4Email, member4Gender,
            member5Name, member5Roll, member5Branch, member5Email, member5Gender,
            member6Name, member6Roll, member6Branch, member6Email, member6Gender,
            problemStatement, solutionExplanation, terms
        } = req.body;

        // Check if team already exists
        const existingTeam = await Registration.findOne({ teamName: teamName.toUpperCase() });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team name already exists. Please choose a different name.'
            });
        }

        // Check for at least one female member
        const genders = [member1Gender, member2Gender, member3Gender, member4Gender, member5Gender, member6Gender];
        if (!genders.includes('FEMALE')) {
            return res.status(400).json({
                success: false,
                message: 'Team must have at least one female member'
            });
        }

        // Create member objects
        const member1 = { name: member1Name, rollNumber: member1Roll, branch: member1Branch, email: member1Email, gender: member1Gender };
        const member2 = { name: member2Name, rollNumber: member2Roll, branch: member2Branch, email: member2Email, gender: member2Gender };
        const member3 = { name: member3Name, rollNumber: member3Roll, branch: member3Branch, email: member3Email, gender: member3Gender };
        const member4 = { name: member4Name, rollNumber: member4Roll, branch: member4Branch, email: member4Email, gender: member4Gender };
        const member5 = { name: member5Name, rollNumber: member5Roll, branch: member5Branch, email: member5Email, gender: member5Gender };
        const member6 = { name: member6Name, rollNumber: member6Roll, branch: member6Branch, email: member6Email, gender: member6Gender };

        // Generate registration ID manually
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await Registration.countDocuments();
        const registrationId = `AI${year}${month}${(count + 1).toString().padStart(4, '0')}`;

        // Create registration
        const registration = new Registration({
            teamName: teamName.toUpperCase(),
            teamLeadMobile,
            member1, member2, member3, member4, member5, member6,
            problemStatement,
            solutionExplanation,
            termsAccepted: terms === 'on',
            registrationId: registrationId
        });

        await registration.save();

        console.log(`✅ Team registered: ${registration.teamName} (ID: ${registration.registrationId})`);

        res.status(201).json({
            success: true,
            message: 'Team registered successfully!',
            data: {
                registrationId: registration.registrationId,
                teamName: registration.teamName
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Team name already exists. Please choose a different name.'
            });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
};

// @desc    Get all registrations
// @route   GET /api/registrations
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ registrationDate: -1 });
        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching registrations'
        });
    }
};