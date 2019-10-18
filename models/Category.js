const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
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

CategorySchema.pre('remove', async function(next) {
  const category = this;
  await category
    .model('country')
    .updateMany({ $pull: { categories: category._id } }, next);
});

module.exports = Category = mongoose.model('category', CategorySchema);
