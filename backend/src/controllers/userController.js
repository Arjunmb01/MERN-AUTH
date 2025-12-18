const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');


const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};


const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};


const uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'crud_app_users' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        // Update user profile with image URL
        const user = await User.findById(req.user._id);
        if (user) {
            user.profileImage = result.secure_url;
            await user.save();
            res.json({
                message: 'Image uploaded successfully',
                imageUrl: result.secure_url
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }

    } catch (error) {
        console.error('Upload Error Details:', error);
        res.status(500).json({
            message: 'Image upload failed',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadProfileImage
};
