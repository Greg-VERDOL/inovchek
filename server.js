const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const morgan = require('morgan');
const session = require('./config/session');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());
app.use(express.json({ extended: false }));
session(app);

// Home
app.get('/', (req, res) => {
  res.send('API Running 🏃‍');
});

// Routes
app.use('/api/analytics', require('./routes/api/analytics'));
app.use('/api/areas', require('./routes/api/areas'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/campaigns', require('./routes/api/campaigns'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/checkpoints', require('./routes/api/checkpoints'));
app.use('/api/countries', require('./routes/api/countries'));
app.use('/api/indicators', require('./routes/api/indicators'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/regions', require('./routes/api/regions'));
app.use('/api/sent_campaigns', require('./routes/api/sent_campaigns'));
app.use('/api/store_types', require('./routes/api/store_types'));
app.use('/api/stores', require('./routes/api/stores'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/users/admin', require('./routes/api/users'));

app.use(
  '/api/checkpoint_submissions',
  require('./routes/api/checkpoint_submissions')
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT} ☑️`)
);
