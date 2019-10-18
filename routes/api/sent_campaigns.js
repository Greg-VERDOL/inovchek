const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Sent_campaign = require('../../models/Sent_campaign');
const Campaign = require('../../models/Campaign');

// @route   POST api/sent_campaigns
// @desc    Create a sent_campaign
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('date', 'Date is required')
        .not()
        .isEmpty(),
      check('analytics', 'Analytics is required')
        .not()
        .isEmpty(),
      check('campaign', 'Please select a campaign')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newSent_campaign = new Sent_campaign({
        date: req.body.date,
        analytics: req.body.analytics,
        campaign: req.body.campaign
      });
      const campaign = Campaign.findById(req.body.campaign);

      const sent_campaign = await newSent_campaign.save();

      await campaign.sent_campaigns.push(sent_campaign);
      await campaign.save();

      res.json(sent_campaign);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/sent_campaigns/:id
// @desc    Update a Sent Campaign
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('date', 'Date is required')
        .not()
        .isEmpty(),
      check('analytics', 'Analytics is required')
        .not()
        .isEmpty()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const modifications = {};
    (modifications.sent_campaign = req.params.id),
      (modifications.date = req.body.date),
      (modifications.analytics = req.body.analytics);

    try {
      const sent_campaign = await Sent_campaign.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(sent_campaign);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Sent campaign not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/sent_campaigns
// @desc    Get all sent_campaigns
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const sent_campaigns = await Sent_campaign.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(sent_campaigns);
    } else {
      const sent_campaigns = await Sent_campaign.find({
        user: req.user.id
      })
        .sort({ date: -1 })
        .populate('user', 'email role');
      res.json(sent_campaigns);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/sent_campaigns/:id
// @desc    Get sent_campaign by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const sent_campaign = await Sent_campaign.findById(req.params.id);

    if (!sent_campaign) {
      return res.status(404).json({ msg: 'Sent campaign not found' });
    }
    if (
      req.user.role !== 'admin' &&
      sent_campaign.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(sent_campaign);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sent campaign not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/sent_campaigns/:id
// @desc    Delete a Campaign Sending
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const sent_campaign = await Sent_campaign.findById(req.params.id);

    if (!sent_campaign) {
      return res.status(404).json({ msg: 'Sent campaign not found' });
    }

    if (
      req.user.role !== 'admin' &&
      sent_campaign.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await sent_campaign.remove();

    res.json({ msg: 'sent_campaign removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sent campaign not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
