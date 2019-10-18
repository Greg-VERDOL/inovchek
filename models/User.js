const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String
    },
    passwordSetToken: {
      type: String,
      default: ''
    },
    passwordSetExpires: {
      type: Date,
      default: Date.now()
    },
    date: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    desactivated: {
      type: Boolean,
      default: false
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store'
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'country'
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'region'
    },
    analytics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'analytic'
      }
    ],
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campaign'
      }
    ],
    checkpoint_submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'checkpointSubmission'
      }
    ]
  }
  //{ toJSON: { virtuals: true } }
);

module.exports = User = mongoose.model('user', UserSchema);
