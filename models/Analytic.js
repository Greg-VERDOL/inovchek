const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnalyticSchema = new Schema({
  period: {
    type: Object,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  settings: {
    type: Object
  },
  userOriginated: {
    type: Boolean,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'region'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store'
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country'
  },
  indicator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'indicator'
  }
});

AnalyticSchema.pre('remove', async function(next) {
  const analytic = this;
  await analytic
    .model('user')
    .updateMany({ $pull: { analytics: analytic._id } }, next);
});

AnalyticSchema.pre('remove', async function(next) {
  const analytic = this;
  await analytic
    .model('region')
    .updateMany({ $pull: { analytics: analytic._id } }, next);
});
AnalyticSchema.pre('remove', async function(next) {
  const analytic = this;
  await analytic
    .model('store')
    .updateMany({ $pull: { analytics: analytic._id } }, next);
});
AnalyticSchema.pre('remove', async function(next) {
  const analytic = this;
  await analytic
    .model('country')
    .updateMany({ $pull: { analytics: analytic._id } }, next);
});
AnalyticSchema.pre('remove', async function(next) {
  const analytic = this;
  await analytic
    .model('indicator')
    .updateMany({ $pull: { analytics: analytic._id } }, next);
});

module.exports = Analytic = mongoose.model('analytic', AnalyticSchema);
