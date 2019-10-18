const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Campaign = require('../../models/Campaign');
const User = require('../../models/User');

// @route   POST api/campaigns
// @desc    Create a campaign
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('recipients', 'One or more recipients are required')
        .not()
        .isEmpty(),
      check('period', 'Period is required')
        .not()
        .isEmpty(),
      check('userOriginated', 'Please choose yes or no')
        .not()
        .isEmpty(),
      sanitizeBody('recipients')
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

      const newCampaign = new Campaign({
        recipients: req.body.recipients,
        startDate: req.body.startDate,
        period: req.body.period,
        frequency: req.body.frequency,
        userOriginated: req.body.userOriginated,
        user: req.user.id
      });

      const campaign = await newCampaign.save();

      await user.campaigns.push(campaign);
      await user.save();

      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);
// @route   PUT api/campaigns/:id
// @desc    Update campaign
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('recipients', 'One or more recipients are required')
        .not()
        .isEmpty(),
      check('period', 'Period is required')
        .not()
        .isEmpty(),
      check('userOriginated', 'Please choose yes or no')
        .not()
        .isEmpty(),
      sanitizeBody('recipients')
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
    (modifications.campaign = req.params.id),
      (modifications.startDate = req.body.startDate),
      (modifications.period = req.body.period),
      (modifications.userOriginated = req.body.userOriginated);

    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Campaign not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/campaigns
// @desc    Get all campaigns
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const campaigns = await Campaign.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(campaigns);
    } else {
      const campaigns = await Campaign.find({ user: req.user.id })
        .sort({
          date: -1
        })
        .populate('user', 'email role');
      res.json(campaigns);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/campaigns/:id
// @desc    Get Campaign by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    if (
      req.user.role !== 'admin' &&
      campaign.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/campaigns/:id
// @desc    Delete a campaign
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    if (
      req.user.role !== 'admin' &&
      campaign.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await campaign.remove();

    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
