const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country'
  },
  checkpoints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'checkpoint'
    }
  ]
});

AreaSchema.pre('remove', async function(next) {
  const area = this;
  await area.model('country').updateMany({ $pull: { areas: area._id } }, next);
});

module.exports = Area = mongoose.model('area', AreaSchema);
