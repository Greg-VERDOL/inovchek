const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndicatorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  humanName: {
    type: String,
    required: true,
    trim: true
  },
  returns: {
    type: String,
    required: true,
    trim: true
  },
  settings: {
    type: Object
  },
  scopes: [
    {
      type: Object,
      required: true
    }
  ]
});

module.exports = Indicator = mongoose.model('indicator', IndicatorSchema);
