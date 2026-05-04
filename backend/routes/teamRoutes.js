const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/Project');
const User = require('../models/User');

router.use(protect);

// @desc    Get all team members across user's projects
// @route   GET /api/teams/members
// @access  Private
router.get('/members', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    }).populate('members.user', 'name email avatar role').populate('owner', 'name email avatar role');

    const memberMap = new Map();
    projects.forEach((project) => {
      // Add owner
      if (project.owner) {
        memberMap.set(project.owner._id.toString(), project.owner);
      }
      // Add members
      project.members.forEach((m) => {
        if (m.user) {
          memberMap.set(m.user._id.toString(), m.user);
        }
      });
    });

    const members = Array.from(memberMap.values());
    res.json({ success: true, count: members.length, members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
