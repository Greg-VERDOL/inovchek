const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  flag: {
    type: String
  },
  text: {
    type: String,
    trim: true
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store'
    }
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  regions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'region'
    }
  ],
  checkpoints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'checkpoint'
    }
  ],
  areas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'area'
    }
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category'
    }
  ],
  store_types: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'storeType'
    }
  ]
});

module.exports = Country = mongoose.model('country', CountrySchema);
