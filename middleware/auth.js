const jwt = require('jsonwebtoken');
const config = require('config');

/* JWT CONGIG MIDDLEWARE*/

module.exports = function(req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token'); // <= we're looking for that on the header through the req

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied ✋' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtToken')); // the token is valid and decoded
    req.user = decoded.user; // decoding object set to the user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid 🚫' }); // got the token but its not valid
  }
};
