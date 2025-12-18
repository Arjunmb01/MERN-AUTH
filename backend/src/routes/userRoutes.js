const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    uploadProfileImage
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/upload-image', protect, upload.single('image'), uploadProfileImage);

module.exports = router;
