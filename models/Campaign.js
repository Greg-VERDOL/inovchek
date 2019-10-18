const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  recipients: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  startDate: {
    type: Date
  },
  period: {
    type: Number
  },
  frequency: {
    type: String,
    required: false
  },
  userOriginated: {
    type: Boolean,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  analytics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'analytic'
    }
  ],
  SentCampaigns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sentCampaign'
    }
  ]
});

CampaignSchema.pre('remove', async function(next) {
  const campaign = this;
  await campaign
    .model('user')
    .updateMany({ $pull: { campaigns: campaign._id } }, next);
});

module.exports = Campaign = mongoose.model('campaign', CampaignSchema);
