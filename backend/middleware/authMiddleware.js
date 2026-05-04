const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin only' });
  }
};

// Project admin (owner or member with admin role)
exports.projectAdmin = (projectField = 'project') => async (req, res, next) => {
  const Project = require('../models/Project');
  const projectId = req.params.projectId || req.body.project || req.params.id;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberEntry = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isMemberAdmin = memberEntry && memberEntry.role === 'admin';
    const isGlobalAdmin = req.user.role === 'admin';

    if (isOwner || isMemberAdmin || isGlobalAdmin) {
      req.project = project;
      return next();
    }

    res.status(403).json({ success: false, message: 'Access denied: Project admin only' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
