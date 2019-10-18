const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Indicator = require('../../models/Indicator');

// @route   POST api/indicators
// @desc    Create an indicator
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
      check('humaneName', 'Human Name is required')
        .not()
        .isEmpty(),
      check('returns', 'Returns is required')
        .not()
        .isEmpty(),
      check('scopes', 'Scopes is required')
        .not()
        .isEmpty(),
      sanitizeBody('name')
        .trim()
        .escape(),
      sanitizeBody('humanName')
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
      const newIndicator = new Indicator({
        name: req.body.name,
        humanName: req.body.humanName,
        returns: req.body.returns,
        settings: req.body.settings,
        scopes: req.body.scopes
      });

      const indicator = await newIndicator.save();

      res.json(indicator);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/indicators/:id
// @desc    Update an indicator
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
      check('humaneName', 'Human Name is required')
        .not()
        .isEmpty(),
      check('returns', 'Returns is required')
        .not()
        .isEmpty(),
      check('scopes', 'Scopes is required')
        .not()
        .isEmpty(),
      sanitizeBody('name')
        .trim()
        .escape(),
      sanitizeBody('humanName')
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
    (modifications.indicator = req.params.id),
      (modifications.name = req.body.name),
      (modifications.humanName = req.body.humanName),
      (modifications.returns = req.body.returns),
      (modifications.settings = req.body.settings),
      (modifications.scopes = req.body.scopes);

    try {
      const indicator = await Indicator.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(indicator);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Indicator not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/indicators
// @desc    Get all indicators
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const indicators = await Indicator.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(indicators);
    } else {
      const indicators = await indicator
        .find({ user: req.user.id })
        .sort({ date: -1 })
        .populate('user', 'email role');
      res.json(indicators);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/indicators/:id
// @desc    Get indicator by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const indicator = await indicator.findById(req.params.id);

    if (!indicator) {
      return res.status(404).json({ msg: 'Indicator not found' });
    }
    if (
      req.user.role !== 'admin' &&
      indicator.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(indicator);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Indicator not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/indicators/:id
// @desc    Delete an indicator
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const indicator = await indicator.findById(req.params.id);

    if (!indicator) {
      return res.status(404).json({ msg: 'Indicator not found' });
    }

    if (
      req.user.role !== 'admin' &&
      indicator.user.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await indicator.remove();

    res.json({ msg: 'Indicator removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Indicator not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
