const User = require('../../models/User');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');
require('dotenv').config();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name,
    email,
    password
  } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [ { message: 'User already exists' } ] });
    }

    const avatar = gravatar.url(email, {
      s: '200', // size
      r: 'pg', // only pg pics allowed
      d: 'mm' // default
    });

    user = new User({
      name,
      email,
      avatar,
      password
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;

      res.cookie('t', token, { expire: new Date() + 3600 });
      res.json({ token });
    })

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    email,
    password
  } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [ { message: 'Invalid Credentials' } ] });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({ errors: [ { message: 'Invalid Credentials' } ] });
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;

      res.cookie('t', token, { expire: new Date() + 3600 });
      res.json({ token });
    })

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Successfully signed out' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth'
});
