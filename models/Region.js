const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country'
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store'
    }
  ]
});

RegionSchema.pre('remove', async function(next) {
  const region = this;
  await region
    .model('country')
    .updateMany({ $pull: { regions: region._id } }, next);
});

module.exports = Region = mongoose.model('region', RegionSchema);
