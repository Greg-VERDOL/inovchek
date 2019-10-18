const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Checkpoint = require('../../models/Checkpoint');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Area = require('../../models/Area');
const Country = require('../../models/Country');

// @route   POST api/checkpoints
// @desc    Create a Checkpoint
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
      check('answers', 'Answers is required')
        .not()
        .isEmpty(),
      check('category', 'Please select a categorie')
        .not()
        .isEmpty(),
      check('country', 'Please select a country')
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
      const user = await User.findById(req.user.id).select();

      const newCheckpoint = new Checkpoint({
        text: req.body.text,
        answers: req.body.answers,
        user: req.user.id,
        category: req.body.category,
        area: req.body.area,
        country: req.body.country
      });
      const category = await Category.findById(req.body.category);
      const area = await Area.findById(req.body.area);
      const country = await Country.findById(req.body.country);

      const checkpoint = await newCheckpoint.save();

      await user.checkpoints.push(checkpoint);
      await user.save();

      await category.checkpoints.push(checkpoint);
      await category.save();

      await area.checkpoints.push(checkpoint);
      await area.save();

      await country.checkpoints.push(checkpoint);
      await country.save();

      res.json(checkpoint);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/stores/:id
// @desc    Update a store
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
      check('answers', 'Answers is required')
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
    const modifications = {};
    (modifications.checkpoint = req.params.id),
      (modifications.text = req.body.text),
      (modifications.answers = req.body.answers);

    try {
      const checkpoint = await Checkpoint.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(checkpoint);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Checkpoint not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/checkpoints
// @desc    Get all Checkpoints
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const checkpoints = await Checkpoint.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(checkpoints);
    } else {
      const checkpoints = await Checkpoint.find({ user: req.user.id })
        .sort({
          date: -1
        })
        .populate('user', 'email role');
      res.json(checkpoints);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/checkpoints/:id
// @desc    Get a Checkpoint by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findById(req.params.id);

    if (!checkpoint) {
      return res.status(404).json({ msg: 'Checkpoint not found' });
    }
    if (
      req.user.role !== 'admin' &&
      checkpoint.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(checkpoint);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Checkpoint not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/checkpoint/:id
// @desc    Delete a Checkpoint
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findById(req.params.id);

    if (!checkpoint) {
      return res.status(404).json({ msg: 'Checkpoint not found' });
    }

    if (
      req.user.role !== 'admin' &&
      checkpoint.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await checkpoint.remove();

    res.json({ msg: 'Checkpoint removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Checkpoint not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
