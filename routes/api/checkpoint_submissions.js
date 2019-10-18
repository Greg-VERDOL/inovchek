const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Checkpoint_submission = require('../../models/Checkpoint_submission');
const User = require('../../models/User');
const Checkpoint = require('../../models/Checkpoint');
const Store = require('../../models/Store');

// @route   POST api/checkpoint_submissions
// @desc    Create a Checkpoint Sumbission
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('answer', 'Answer is required')
        .not()
        .isEmpty(),
      check('date', 'Date is required')
        .not()
        .isEmpty(),
      check('checkpoint', 'Please select checkpoint')
        .not()
        .isEmpty(),
      check('store', 'Please select a store')
        .not()
        .isEmpty(),
      sanitizeBody('answer')
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
    try {
      const user = await User.findById(req.user.id).select();

      const newCheckpoint_submission = new Checkpoint_submission({
        answer: req.body.answer,
        text: req.body.text,
        files: req.body.files,
        date: req.body.date,
        user: req.user.id,
        checkpoint: req.body.checkpoint,
        store: req.body.store
      });
      const checkpoint = await Checkpoint.findById(req.body.checkpoint);
      const store = await Store.findById(req.body.store);

      const checkpoint_submission = await newCheckpoint_submission.save();

      await user.checkpoint_submissions.push(checkpoint_submission);
      await user.save();

      await checkpoint.checkpoint_submissions.push(checkpoint_submission);
      await checkpoint.save();

      await store.checkpoint_submissions.push(checkpoint_submission);
      await store.save();

      res.json(checkpoint_submission);
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
      check('answer', 'Answer is required')
        .not()
        .isEmpty(),
      check('date', 'Date is required')
        .not()
        .isEmpty(),
      sanitizeBody('answer')
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
    (modifications.checkpoint_submission = req.params.id),
      (modifications.answer = req.body.answer),
      (modifications.text = req.body.text),
      (modifications.date = req.body.date);

    try {
      const checkpoint_submission = await Checkpoint_submission.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(checkpoint_submission);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Submission not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/checkpoint_submissions
// @desc    Get all Checkpoint Sumbmissions
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const checkpoint_submissions = await Checkpoint_submission.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(checkpoint_submissions);
    } else {
      const checkpoint_submissions = await Checkpoint_submission.find({
        user: req.user.id
      })
        .sort({
          date: -1
        })
        .populate('user', 'email role');
      res.json(checkpoint_submissions);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/checkpoint_submissions/:id
// @desc    Get a Checkpoint Submission by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const checkpoint_submission = await Checkpoint_submission.findById(
      req.params.id
    );

    if (!checkpoint_submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    if (
      req.user.role !== 'admin' &&
      checkpoint_submission.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(checkpoint_submission);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/checkpoint_submissions/:id
// @desc    Delete a Checkpoint Submission
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const checkpoint_submission = await Checkpoint_submission.findById(
      req.params.id
    );

    if (!checkpoint_submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    if (
      req.user.role !== 'admin' &&
      checkpoint_submission.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await checkpoint_submission.remove();

    res.json({ msg: 'Submission removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
