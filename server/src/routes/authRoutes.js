const express = require('express');
const router = express.Router();

const bcryptMiddleware = require('../middleware/bcryptMiddleware');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const middleware = require('../middleware/validationMiddleware');
const userController = require('../controllers/userController');

router.post("/register", bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/login/check-role", middleware.isAdmin);
router.post("/login/otp", )
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

module.exports = router; 