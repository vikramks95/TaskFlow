const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/project/:projectId', getTasksByProject);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title').notEmpty().withMessage('Task title is required'),
      body('project').notEmpty().withMessage('Project is required'),
    ],
    createTask
  );

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;
