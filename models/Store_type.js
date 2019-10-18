const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country'
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store'
    }
  ]
});

StoreTypeSchema.pre('remove', async function(next) {
  const StoreType = this;
  await StoreType.model('store').updateMany(
    { $pull: { StoreTypes: StoreType._id } },
    next
  );
});

StoreTypeSchema.pre('remove', async function(next) {
  const StoreType = this;
  await StoreType.model('country').updateMany(
    { $pull: { StoreTypes: StoreType._id } },
    next
  );
});

StoreTypeSchema.pre('remove', async function(next) {
  const StoreType = this;
  await StoreType.model('store').updateMany(
    { $pull: { StoreTypes: store._id } },
    next
  );
  console.log(store._id);
});

module.exports = StoreType = mongoose.model('store_type', StoreTypeSchema);
