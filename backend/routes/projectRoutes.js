const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getProjects).post(
  [body('name').notEmpty().withMessage('Project name is required')],
  createProject
);

router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

router.route('/:id/members').post(addMember);
router.route('/:id/members/:userId').delete(removeMember);
router.route('/:id/stats').get(getProjectStats);

module.exports = router;
