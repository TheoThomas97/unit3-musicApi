
const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  [
    
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),

    body('email')
      .isEmail()
      .withMessage('Valid email required')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists().withMessage('Password is required')
  ],
  login
);

module.exports = router;
