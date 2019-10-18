const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SentCampaignSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  analytics: {
    type: {},
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'campaign'
  }
});

SentCampaignSchema.pre('remove', async function(next) {
  const SentCampaign = this;
  await SentCampaign.model('campaign').updateMany(
    { $pull: { SentCampaigns: SentCampaign._id } },
    next
  );
});

module.exports = SentCampaign = mongoose.model(
  'sent_campaign',
  SentCampaignSchema
);
