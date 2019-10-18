const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinate: {
      type: [Number]
    }
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country'
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'region'
  },
  store_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store_type'
  },
  areas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'area'
    }
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  checkpoint_submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'checkpointSubmission'
    }
  ]
});

StoreSchema.methods.findByRegion = async function findByRegion() {
  return await Region.find({ region: this._id });
};

StoreSchema.pre('remove', async function(next) {
  const store = this;
  await store
    .model('country')
    .updateMany({ $pull: { stores: store._id } }, next);
});

StoreSchema.pre('remove', async function(next) {
  const store = this;
  await store
    .model('region')
    .updateMany({ $pull: { stores: store._id } }, next);
});

StoreSchema.pre('remove', async function(next) {
  const store = this;
  await store
    .model('store_type')
    .updateMany({ $pull: { stores: store._id } }, next);
});

module.exports = Store = mongoose.model('store', StoreSchema);
