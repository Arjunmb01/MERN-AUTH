const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/refresh', refreshAccessToken);

module.exports = router;
