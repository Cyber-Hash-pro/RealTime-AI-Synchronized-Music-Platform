const express = require('express');
const passport = require('passport')
const router = express.Router();
const AuthController = require('../controllers/auth.controller.js');
const {registerValidation,loginValidation} = require('../middleware/validation.middleware.js');

router.post('/register',registerValidation, AuthController.register);
router.post('/login',loginValidation, AuthController.login);
router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',passport.authenticate('google', { session: false }),AuthController.GoogleAuthCallback);

module.exports = router;