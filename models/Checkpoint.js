const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckpointSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  answers: {
    type: Object,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'area'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
  checkpoint_submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'checkpointSubmission'
    }
  ]
});

CheckpointSchema.pre('remove', async function(next) {
  const checkpoint = this;
  await checkpoint
    .model('category')
    .updateMany({ $pull: { checkpoints: checkpoint._id } }, next);
});

CheckpointSchema.pre('remove', async function(next) {
  const checkpoint = this;
  await checkpoint
    .model('area')
    .updateMany({ $pull: { checkpoints: checkpoint._id } }, next);
});

CheckpointSchema.pre('remove', async function(next) {
  const checkpoint = this;
  await checkpoint
    .model('user')
    .updateMany({ $pull: { checkpoints: checkpoint._id } }, next);
});

CheckpointSchema.pre('remove', async function(next) {
  const checkpoint = this;
  await checkpoint
    .model('country')
    .updateMany({ $pull: { checkpoints: checkpoint._id } }, next);
});

module.exports = Checkpoint = mongoose.model('checkpoint', CheckpointSchema);
