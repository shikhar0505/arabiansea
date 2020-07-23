const express = require('express');
const router = express.Router();
const { userById } = require('../../controllers/api/user');
const { requireSignin } = require('../../controllers/api/auth');

router.param('userId', userById);

router.get('/secret/:userId', requireSignin, (req, res) => {
  res.json({
    user: req.profile
  });
})

module.exports = router;
