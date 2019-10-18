const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      'name',
      'email'
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// // @route   POST api/profile/
// // @desc    Create or update user profile
// // @access  Private
// router.post('/', auth, async (req, res) => {
//   const profileFields = {};
//   profileFields.user = req.user.id;

//   try {
//     let profile = await Profile.findOne({ user: req.user.id });
//     if (profile) {
//       // update
//       profile = await Profile.findOneAndUpdate(
//         { user: req.user.id },
//         { new: true }
//       );
//       return res.json(profile);
//     }
//     //  create
//     profile = new Profile(profileFields);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error 😞');
//   }
// });

// @route   GET api/profile/
// @desc    Get all profiles for dev only
// @access  Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      'user',
      'firstName',
      'lastName'
    );
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
