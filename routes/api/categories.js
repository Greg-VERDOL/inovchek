const express = require('express');
const router = express.Router();
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Country = require('../../models/Country');

// @route   POST api/categories
// @desc    Create a category
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

      const newCategory = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        country: req.body.country
      });
      const country = await Country.findById(req.body.country);

      const category = await newCategory.save();

      await country.categories.push(category);
      await country.save();

      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/categories/:id
// @desc    Update a category
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
    (modifications.category = req.params.id),
      (modifications.name = req.body.name),
      (modifications.icon = req.body.icon),
      (modifications.color = req.body.color);

    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      res.json(category);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Category not found' });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const categories = await Category.find()
        .populate('user', 'email role')
        .populate('country', 'name -_id')
        .sort({ date: -1 });
      res.json(categories);
    } else {
      const categories = await Category.find({ user: req.user.id })
        .sort({
          date: -1
        })
        .populate('user', 'email role')
        .populate('country', 'name -_id');
      res.json(categories);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/categories/:id
// @desc    Get Category by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    if (
      req.user.role !== 'admin' &&
      category.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    if (
      req.user.role !== 'admin' &&
      category.user._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await category.remove();

    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
