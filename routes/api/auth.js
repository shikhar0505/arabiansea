const express = require('express');
const router = express.Router();
const { register, signin, requireSignin, signout } = require('../../controllers/api/auth');
const { check } = require('express-validator');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Email is required')
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @"),
  check('password', 'Password is required').notEmpty(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 charaters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
], register);

// @route   POST api/auth/signin
// @desc    Authenticate user
// @access  Public
router.post('/signin', [
  check('email', 'Email is required')
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @"),
  check('password', 'Password is required').notEmpty(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 charaters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
], signin);

// @route   POST api/auth/signout
// @desc    Signout user
// @access  Private
router.post('/signout', requireSignin, signout);

module.exports = router;
