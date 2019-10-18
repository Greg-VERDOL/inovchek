const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Store = require('../../models/Store');
const Region = require('../../models/Region');
const Country = require('../../models/Country');
const Store_type = require('../../models/Store_type');
const User = require('../../models/User');

// @route   POST api/stores
// @desc    Create a store
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      (check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('address', 'Address is required')
        .not()
        .isEmpty(),
      check('location', 'Location is required')
        .not()
        .isEmpty(),
      check('region', 'Please select a region')
        .not()
        .isEmpty(),
      check('country', 'Please select a country')
        .not()
        .isEmpty(),
      check('store_type', 'Please select a store type')
        .not()
        .isEmpty(),
      sanitizeBody('name')
        .trim()
        .escape(),
      sanitizeBody('address')
        .trim()
        .escape(),
      sanitizeBody('location')
        .trim()
        .escape(),
      sanitizeBody('phone')
        .trim()
        .escape())
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newStore = new Store({
        name: req.body.name,
        location: req.body.location,
        address: req.body.address,
        phone: req.body.phone,
        region: req.body.region,
        country: req.body.country,
        store_type: req.body.store_type
      });
      const region = await Region.findById(req.body.region);
      const country = await Country.findById(req.body.country);
      const store_type = await Store_type.findById(req.body.store_type);
      const user = await User.findById(req.user.id);
      console.log(user);

      const store = await newStore.save();

      await region.stores.push(store);
      await region.save();

      await country.stores.push(store);
      await country.save();

      await store_type.stores.push(store);
      await store_type.save();

      await store.users.push(user);
      await store.save();

      await res.json(store);
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
      (check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('location', 'Location is required')
        .not()
        .isEmpty(),
      check('address', 'Address is required')
        .not()
        .isEmpty(),
      sanitizeBody('name')
        .trim()
        .escape(),
      sanitizeBody('address')
        .trim()
        .escape(),
      sanitizeBody('location')
        .trim()
        .escape(),
      sanitizeBody('phone')
        .trim()
        .escape(),
      sanitizeBody('coordinates')
        .trim()
        .escape())
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const modifications = {};
    (modifications.store = req.params.id),
      (modifications.name = req.body.name),
      (modifications.address = req.body.address),
      (modifications.phone = req.body.phone),
      (modifications.coordinates = req.body.coordinates);

    try {
      const store = await Store.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(store);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Store not found'
        });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/stores
// @desc    Get all stores
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const stores = await Store.find()
        .populate('region', 'name -_id')
        .populate('country', 'name -_id')
        // .populate({ path: 'store_type', populate: { path: 'country' } })
        .populate('store_type', 'name-_id')
        .sort({ date: -1 });
      res.json(stores);
    } else {
      console.log(req.user.id);
      const stores = await Store.find({ users: req.user.id })

        // .populate('user', 'email role -_id')
        .populate({
          path: 'user',
          populate: {
            path: 'country',
            populate: { path: 'store' }
          }
        })
        // .populate('region', 'name -_id')
        // .populate('country', 'name -_id')
        // .populate('store_type', 'name-_id')
        .populate('store', 'name-_id');
      // .sort({ date: -1 });
      console.log(stores);
      res.json(stores);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
  console.log(req.cookies);
});

// @route   GET api/stores/:id
// @desc    Get store by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate(
      'user',
      'email role'
    );

    if (!store) {
      return res.status(404).json({ msg: 'Store not found' });
    }
    if (req.user.role !== 'admin' && store.user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(store);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Store not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/stores/:id
// @desc    Delete a store
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    console.log(store);
    if (!store) {
      return res.status(404).json({ msg: 'Store not found' });
    }

    // if (req.user.role !== 'admin' && store.user.id.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'User not authorized' });
    // }

    await store.remove();
    res.json({ msg: 'Store removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Store not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
