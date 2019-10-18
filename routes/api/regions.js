const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Region = require('../../models/Region');
const Country = require('../../models/Country');

// @route   POST api/regions
// @desc    Create an region
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('country', 'Please select a country')
        .not()
        .isEmpty(),
      sanitizeBody('name')
        .trim()
        .escape()
    ]
  ],
  async (req, res, err) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newRegion = new Region({
        name: req.body.name,
        country: req.body.country
      });
      const country = await Country.findById(req.body.country);

      const region = await newRegion.save();

      await country.regions.push(region);
      await country.save();

      res.json(region);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/regions/:id
// @desc    Update a region
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
      sanitizeBody('name')
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
    (modifications.region = req.params.id),
      (modifications.name = req.body.name);
    try {
      const region = await Region.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(region);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Region not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/regions
// @desc    Get all regions
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const regions = await Region.find()
        .populate('user', 'email role')
        .populate('country', 'name -_id')
        .sort({ date: -1 });
      res.json(regions);
    } else {
      const regions = await Region.find({ users: req.user.id })
        .sort({ date: -1 })
        .populate('user', 'email role')
        .populate('country', 'name -_id');
      res.json(regions);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/regions/:id
// @desc    Get region by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({ msg: 'Region not found' });
    }
    if (
      req.user.role !== 'admin' &&
      region.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(region);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Region not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/regions/:id
// @desc    Delete an region
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({ msg: 'Region not found' });
    }
    if (
      req.user.role !== 'admin' &&
      region.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await region.remove();
    res.json({ msg: 'Region removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Region not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
