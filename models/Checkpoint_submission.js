const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckpointSubmissionSchema = new Schema({
  answer: {
    type: Object,
    required: true
    //trim: true
  },
  text: {
    type: String,
    trim: true
  },
  files: [
    {
      type: Object
    }
  ],
  date: {
    type: Date,
    required: true
  },
  checkpoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'checkpoint'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store'
  }
});

CheckpointSubmissionSchema.pre('remove', async function(next) {
  const checkpointSubmission = this;
  await checkpointSubmission
    .model('checkpoint')
    .updateMany(
      { $pull: { checkpointSubmission: checkpointSubmission._id } },
      next
    );
});

CheckpointSubmissionSchema.pre('remove', async function(next) {
  const checkpointSubmission = this;
  await checkpointSubmission
    .model('user')
    .updateMany(
      { $pull: { checkpointSubmission: checkpointSubmission._id } },
      next
    );
});

CheckpointSubmissionSchema.pre('remove', async function(next) {
  const checkpointSubmission = this;
  await checkpointSubmission
    .model('store')
    .updateMany(
      { $pull: { checkpointSubmission: checkpointSubmission._id } },
      next
    );
});

module.exports = CheckpointSubmission = mongoose.model(
  'checkpoint_submission',
  CheckpointSubmissionSchema
);
