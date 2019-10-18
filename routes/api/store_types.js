const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Store_type = require('../../models/Store_type');
const Country = require('../../models/Country');

// @route   POST api/store_types
// @desc    Create a store type
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
      check('country', 'Country is required')
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
      const newStore_type = new Store_type({
        name: req.body.name,
        country: req.body.country
      });

      const country = await Country.findById(req.body.country);

      const store_type = await newStore_type.save();

      await country.store_types.push(store_type);
      await country.save();

      res.json(store_type);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/store_types/:id
// @desc    Update a store type
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
    (modifications.store_type = req.params.id),
      (modifications.name = req.body.name);

    try {
      const store_type = await Store_type.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(store_type);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Store Type not found' });
      }
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/store_types
// @desc    Get all types of stores
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const store_types = await Store_type.find()
        .populate('user', 'email role')
        .sort({ date: -1 });
      res.json(store_types);
    } else {
      const store_types = await Store_type.find({ user: req.user.id })
        .sort({
          date: -1
        })
        .populate('user', 'email role');
      res.json(store_types);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/store_types/:id
// @desc    Get a type of store by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const store_type = await Store_type.findById(req.params.id);

    if (!store_type) {
      return res.status(404).json({ msg: 'Store Type not found' });
    }
    if (
      req.user.role !== 'admin' &&
      store_type.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(store);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Store Type not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/store_types/:id
// @desc    Delete a type of store
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const store_type = await Store_type.findById(req.params.id);

    if (!store_type) {
      return res.status(404).json({ msg: 'Store Type not found' });
    }

    if (
      req.user.role !== 'admin' &&
      store_type.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await store_type.remove();

    res.json({ msg: 'Store Type removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Store Type not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
