const express = require('express');
const router = express.Router();
const { getUsers, getStats, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getStats);
router.delete('/user/:id', protect, admin, deleteUser);

module.exports = router;
