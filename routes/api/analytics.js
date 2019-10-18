const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Analytic = require('../../models/Analytic');
const User = require('../../models/User');
const Region = require('../../models/Region');
const Store = require('../../models/Store');
const Country = require('../../models/Country');
const Indicator = require('../../models/Indicator');

// @route   POST api/analytics
// @desc    Create an analysis
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('period', 'Period range is required')
        .not()
        .isEmpty(),
      check('scope', 'The scope range is required')
        .not()
        .isEmpty(),
      check('userOriginated', 'Please choose yes or no')
        .not()
        .isEmpty(),
      check('region', 'Please select a region')
        .not()
        .isEmpty(),
      check('store', 'Please select a store')
        .not()
        .isEmpty(),
      check('country', 'Please select a country')
        .not()
        .isEmpty(),
      check('indicator', 'Please select an indicator')
        .not()
        .isEmpty(),
      sanitizeBody('scope')
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
      const user = await User.findById(req.user.id).select();

      const newAnalytic = new Analytic({
        period: req.body.period,
        scope: req.body.scope,
        settings: req.body.settings,
        userOriginated: req.body.userOriginated,
        user: req.user.id,
        region: req.body.region,
        store: req.body.store,
        country: req.body.country,
        indicator: req.body.indicator
      });

      const region = await Region.findById(req.body.region);
      const store = await Store.findById(req.body.store);
      const country = await Country.findById(req.body.country);
      const indicator = await Indicator.findById(req.body.indicator);

      const analytic = await newAnalytic.save();

      await user.analytics.push(analytic);
      await user.save();

      await region.analytics.push(analytic);
      await region.save();

      await store.analytics.push(analytic);
      await store.save();

      await country.analytics.push(analytic);
      await country.save();

      await indicator.analytics.push(analytic);
      await indicator.save();

      res.json(analytic);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/analytics/:id
// @desc    Update analysis
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('period', 'Period range is required')
        .not()
        .isEmpty(),
      check('scope', 'The scope range is required')
        .not()
        .isEmpty(),
      check('userOriginated', 'Please choose yes or no')
        .not()
        .isEmpty(),
      sanitizeBody('scope')
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
    (modifications.analytic = req.params.id),
      (modifications.period = req.body.period),
      (modification.scope = req.body.scope),
      (modification.settings = req.body.settings),
      (modification.userOriginated = req.body.userOriginated);

    try {
      const analytic = await Analytic.findByIdAndUpdate(
        req.params.id,
        { set: modifications },
        { new: true }
      );
      res.json(analytic);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Analysis not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/analytics
// @desc    Get all analysis
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const analytics = await Analytic.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(analytics);
    } else {
      const analytics = await Analytic.find({ user: req.user.id })
        .sort({
          date: -1
        })
        .populate('user', 'email role');
      res.json(analytics);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/analytics/:id
// @desc    Get Analysis by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const analytic = await Analytic.findById(req.params.id);

    if (!analytic) {
      return res.status(404).json({ msg: 'Analysis not found' });
    }
    if (
      req.user.role !== 'admin' &&
      analytic.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(analytic);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Analysis not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/analytics/:id
// @desc    Delete an analysis
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const analytic = await Analytic.findById(req.params.id);

    if (!analytic) {
      return res.status(404).json({ msg: 'Analysis not found' });
    }

    if (
      req.user.role !== 'admin' &&
      analytic.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await analytic.remove();

    res.json({ msg: 'Analysis removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Analysis not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
