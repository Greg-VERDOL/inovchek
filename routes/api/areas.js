const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Area = require('../../models/Area');
const Country = require('../../models/Country');

// @route   POST api/areas
// @desc    Create an area
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select();

      const newArea = new Area({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        country: req.body.country
      });
      const country = await Country.findById(req.body.country);

      const area = await newArea.save();

      await country.areas.push(area);
      await country.save();

      await res.json(area);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/areas/:id
// @desc    Update areas
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
    (modifications.area = req.params.id),
      (modifications.name = req.body.name),
      (modifications.icon = req.body.icon),
      (modifications.color = req.body.color);

    try {
      const area = await Area.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(area);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Area not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/areas
// @desc    Get all areas
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const areas = await Area.find()
        .populate('user', 'email role')
        .populate('country', 'name -_id')
        .sort({ date: -1 });
      res.json(areas);
    } else {
      const areas = await Area.find({ user: req.user.id })
        .sort({ date: -1 })
        .populate('user', 'email role')
        .populate('country', 'name -_id');
      res.json(areas);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/stores/:id
// @desc    Get store by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({ msg: 'Area not found' });
    }
    if (req.user.role !== 'admin' && area.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(area);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Area not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/stores/:id
// @desc    Delete a store
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({ msg: 'Area not found' });
    }

    if (req.user.role !== 'admin' && area.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await area.remove();

    res.json({ msg: 'Area removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Area not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
