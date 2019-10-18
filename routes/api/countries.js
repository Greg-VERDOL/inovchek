const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');
const _ = require('lodash');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Country = require('../../models/Country');

// @route   POST api/countries
// @desc    Create a country
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
        .custom(async (value, { req }) => {
          let country = await Country.findOne({ countryName: value });
          if (!_.isEmpty(country)) {
            return false;
          }
        })
        .withMessage('Country already exist'),
      check('code', 'Country code is required')
        .not()
        .isEmpty(),
      sanitizeBody('text')
        .trim()
        .escape()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newCountry = new Country({
        name: req.body.name,
        code: req.body.code,
        flag: req.body.flag,
        text: req.body.text
      });

      const country = await newCountry.save();

      res.json(country);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/countries/:id
// @desc    Update a country
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('code', 'Country code is required')
        .not()
        .isEmpty(),
      sanitizeBody('name')
        .trim()
        .escape(),
      sanitizeBody('text')
        .trim()
        .escape()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const modifications = {};
    (modifications.country = req.params.id),
      (modifications.name = req.body.name),
      (modifications.code = req.body.code),
      (modifications.flag = req.body.flag),
      (modifications.text = req.body.text);

    try {
      const country = await Country.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(country);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Country not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/countries
// @desc    Get all countries
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const countries = await Country.find()
        .populate('user', 'email role -_id')
        .sort({ date: -1 });
      res.json(countries);
    } else {
      const countries = await Country.find({ user: req.user.id })
        .populate('user', 'email role -_id')
        .sort({ date: -1 });
      res.json(countries);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/coutries/:id
// @desc    Get Country by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const country = await Country.findById(req.params.id).populate(
      'user',
      'email role'
    );

    if (!country) {
      return res.status(404).json({ msg: 'Country not found' });
    }
    if (
      req.user.role !== 'admin' &&
      country.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(country);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Country not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/countries/:id
// @desc    Delete a country
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (!country) {
      return res.status(404).json({ msg: 'Country not found' });
    }

    if (
      req.user.role !== 'admin' &&
      country.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await country.remove();

    res.json({ msg: 'Country removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Country not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});
module.exports = router;
