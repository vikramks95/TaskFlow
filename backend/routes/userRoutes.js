const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserRole } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/role', adminOnly, updateUserRole);

module.exports = router;
