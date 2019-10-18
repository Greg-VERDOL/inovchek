const acl = require('express-acl');

/* ROLE CONGIG MIDDLEWARE*/

const configObject = {
  filename: 'acl.json',
  path: './middleware/acl',
  defaultRole: 'anonymous',
  baseUrl: '/api',
  decodedObjectName: ['user']
};

acl.config(configObject);

module.exports = acl;
