const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    createUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/users')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
