const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// const sessionChecker = (req, res, next) => {
//   if (req.session.user) {
//     res.redirect('/app/dashboard');
//   } else {
//     next();
//   }
// };

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error 😞');
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring
    const { email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // See if the user is desactivate
      let desactivateUser = await User.findOne({ email });
      if (desactivateUser.desactivated === true) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials (desactivated)' }] });
      }

      // Compare the password to know if is match
      const isMatch = await bcrypt.compare(password, user.password);

      // Not matching
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken & Getting the payload
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
      // Signin the token
      jwt.sign(
        payload, // Push the payload inside token
        config.get('jwtToken'), // Configure the payload
        {
          expiresIn: 360000
        }, // Set at 100 hours for development needs. It will have to be replaced and put on 3600 in production
        (err, token) => {
          if (err) throw err;
          res.json({ token, role: user.role }); // Token sent back to the client
        }
      );

      req.session.isLoggedIn = true;
      req.session.user = user;
      user.password = null;
      delete user.password;
      res.locals.user = user;

      const err = await req.session.save();
      if (err) throw err;
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error 😞');
    }
  }
);

// @route   GET api/auth/logout
// @desc    Logout user and clear session
// @access  Private
router.get('/logout', auth, async (req, res) => {
  res.status(200).clearCookie('connect.sid');
  req.session.destroy(err => {
    res.redirect('/');
  });
});

module.exports = router;
