const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');

const db = config.get('mongoURI');

const store = new MongoDBStore({
  uri: db,
  collection: 'sessions',
  ttl: (1000 * 60 * 60 * 2) / 1000
});

/* SESSION MIDDLEWARE*/

module.exports = app => {
  app.use(
    session({
      secret: config.get('secret'),
      resave: false, // Save the session to store even if it hasn't changed
      saveUninitialized: true,
      rolling: true, //Reset the cookie Max-Age on every request
      store: store,
      httpOnly: true,
      secure: true,
      ephemeral: true,
      cookie: {
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 2
      }
    })
  );
};
