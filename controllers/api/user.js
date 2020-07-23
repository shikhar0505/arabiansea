const User = require('../../models/User');

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .select('-hashed_password')
    .select('-salt')
    .exec((e, user) => {
      if (e || !user) {
        return res.status(400).json({ error: 'User not found' });
      }
      req.profile = user;
      next();
    });
}
