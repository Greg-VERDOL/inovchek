const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');

const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
const Token = require('../../models/Token');
const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');
const Store = require('../../models/Store');
const Region = require('../../models/Region');
const Country = require('../../models/Country');

const api = config.get('API-Sendgrid');
sgMail.setApiKey(api);

//@route  POST api/users
//@desc   Create a User
//@access Public
router.post(
  '/',
  auth,
  acl.authorize,
  [
    check('email', 'Please include a valid email')
      .isEmail()
      .custom(async (value, { req }) => {
        let user = await User.findOne({ email: value });
        if (!_.isEmpty(user)) {
          return false;
        }
      })
      .withMessage('Email already exists'),
    check('role', 'Role is required')
      .not()
      .isEmpty(),
    sanitizeBody('role')
      .trim()
      .escape(),
    sanitizeBody('email')
      .trim()
      .escape()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    let errorArray = errors.array();

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errorArray[0].msg);
    }

    try {
      const password = crypto.randomBytes(16).toString('hex');

      const newUser = new User({
        email: req.body.email,
        role: req.body.role,
        country: req.body.country,
        region: req.body.region,
        store: req.body.store
      });

      const user = await newUser.save();

      if (user.role === 'manager') {
        const { store } = req.body;

        const storeFind = await Store.findById(store);
        await storeFind.users.push(user);

        await storeFind.save();
      } else if (user.role === 'region') {
        const { region } = req.body;

        const regionFind = await Region.findById(region);
        console.log(region);
        await regionFind.users.push(user);

        await regionFind.save();
      } else if (user.role === 'country') {
        const { country } = req.body;

        const countryFind = await Country.findById(country);
        await countryFind.users.push(user);
        console.log(user);

        await countryFind.save();
      }
      res.json(user);

      next();

      const token = new Token({
        _id: user.id,
        token: crypto.randomBytes(16).toString('hex')
      });

      req.body.passwordSetToken = token.token;
      req.body.passwordSetExpires = moment().add(24, 'hours');
      req.body.password = password;

      (user.passwordSetToken = req.body.passwordSetToken),
        (user.passwordSetExpires = req.body.passwordSetExpires),
        (user.password = req.body.password),
        (user.name = req.body.name),
        token.save();
      console.log(token);
      await user.save();

      /* SEND EMAIL TO NEW USER */

      const msg = {
        to: user.email,
        from: 'no-reply@inovcheck.fr',
        subject: 'Setup your ✅ Inovcheck password',
        html: `<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
          <!--<![endif]-->
          <!--[if (gte mso 9)|(IE)]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <!--[if (gte mso 9)|(IE)]>
          <style type="text/css">
            body {width: 600px;margin: 0 auto;}
            table {border-collapse: collapse;}
            table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
            img {-ms-interpolation-mode: bicubic;}
          </style>
          <![endif]-->
          <style type="text/css">
            body,
            p,
            div {
            font-family: verdana, geneva, sans-serif;
            font-size: 16px;
            }
            body {
            color: #053257;
            }
            body a {
            color: #e0cd59;
            text-decoration: none;
            }
            p {
            margin: 0;
            padding: 0;
            }
            table.wrapper {
            width: 100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            }
            img.max-width {
            max-width: 100% !important;
            }
            .column.of-2 {
            width: 50%;
            }
            .column.of-3 {
            width: 33.333%;
            }
            .column.of-4 {
            width: 25%;
            }
            @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
            text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
            text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
            }
            table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
            }
            img.max-width {
            height: auto !important;
            max-width: 480px !important;
            }
            a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
            }
            .columns {
            width: 100% !important;
            }
            .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            }
            }
          </style>
          <!--user entered Head Start-->
          <!--End Head user entered-->
        </head>
        <body>
          <center class="wrapper" data-link-color="#e0cd59" data-body-style="font-size: 16px; font-family: verdana,geneva,sans-serif; color: #053257; background-color: #ffffff;">
            <div class="webkit">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff">
                <tr>
                  <td valign="top" bgcolor="#ffffff" width="100%">
                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="100%">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td>
                                <!--[if mso]>
                                <center>
                                  <table>
                                    <tr>
                                      <td width="600">
                                        <![endif]-->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                                          <tr>
                                            <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #053257; text-align: left;" bgcolor="#ffffff" width="100%" align="left">
                                              <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                                <tr>
                                                  <td role="module-content">
                                                    <p></p>
                                                  </td>
                                                </tr>
                                              </table>
                                              <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                                <tr>
                                                  <td style="background-color:#ffffff;padding:50px 0px 20px 0px;line-height:35px;text-align:justify;" height="100%" valign="top" bgcolor="#ffffff">
                                                    <div style="text-align: center;"><span style="color: rgb(5, 50, 87); font-family: verdana, geneva, sans-serif; font-size: 36px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; text-align: center;">✅&nbsp;</span><span style="font-size:36px;"><strong>Inovcheck</strong></span></div>                                                  </td>
                                                </tr>
                                              </table>
                                              <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                                <tr>
                                                  <td style="padding:40px 40px 40px 40px;line-height:30px;text-align:justify;background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff">
                                                    <div style="text-align: center;"><span style="font-size:18px;">You are receive this because you (or someone else) have request the setup of the password for you Inovcheck account.</span></div>
                                                    <div style="text-align: center;">&nbsp;</div>
                                                    <div style="text-align: center;"><span style="font-size:18px;">Please click on the following link, or paste this into your browser to complete the process :</span></div>
                                                    <div style="text-align: center;"><a href="http://localhost:3000/app/setup/${
                                                      token.token
                                                    }">SET UP YOUR PASSWORD</a></div>
                                                    <div style="text-align: center;">&nbsp;</div>
                                                    <div style="text-align: center;"><span style="font-size:18px;">If you don't request this, please ignore this email.</span></div>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                        <!--[if mso]>
                                      </td>
                                    </tr>
                                  </table>
                                </center>
                                <![endif]-->
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </center>
        </body>
      </html>`
      };
      //sgMail.send(msg);
    } catch (err) {
      {
        console.error(err.message);
        res.status(500).send('Server Error 😞');
      }
    }
  }
);

// @route   POST api/users/setup/:token
// @desc    Set user account for a user
// @access  Public
router.post(
  '/setup/:id',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('password', 'Your password must be at least 6 characters')
      .isLength({ min: 6 })
      .not()
      .isEmpty(),
    sanitizeBody('name')
      .trim()
      .escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    let errorArray = errors.array();

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errorArray[0].msg);
    }
    try {
      const token = await Token.findOne({ token: req.params.id });

      if (!token) {
        return res.status(404).json({
          msg: 'This token is not valid'
        });
      }

      const user = await User.findById(token._id);
      if (!user) {
        return res.status(404).json({
          msg: `User token and your token didn't match`
        });
      }

      if (user.passwordSetToken !== token.token) {
        return res.status(404).json({
          msg: `User token and your token didn't match. You may have a more recent token in your mail list.`
        });
      }

      if (moment().utcOffset(0) > user.passwordSetExpires) {
        return res.status(404).json({
          msg: 'Token has expired'
        });
      }

      const { name, password } = req.body;
      user.name = name;
      user.password = password;

      user.passwordSetToken = '';
      user.passwordSetExpires = moment().utcOffset(0);
      user.isActive = true;

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          console.log('tokenJWT', token);
          res.json({ token });
        }
      );

      await user.save();
      res.json;
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/users/admin/:id
// @desc    Update a User as Admin
// @access  Private
router.put(
  '/admin/:id',
  [auth],

  async (req, res) => {
    const errors = validationResult(req);

    let errorArray = errors.array();

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errorArray[0].msg);
    }

    const modifications = {};
    (modifications.user = req.params.id),
      (modifications.name = req.body.name),
      (modifications.desactivated = req.body.desactivated);
    //(modifications.isActive = req.body.isActive);

    // if (modifications.desactivated === true) {
    //   req.body.isActive == false;
    // }

    try {
      const authHeader = req.get('x-auth-token');
      const decoded = jwt.verify(authHeader, config.get('jwtToken'));
      userAuth = decoded.user;

      if (userAuth.id != req.params.id && userAuth.role != 'admin') {
        return res.status(401).json({
          msg: 'User not authorized'
        });
      } else if (
        (userAuth.id != req.params.id && userAuth.role === 'admin') ||
        userAuth.id === req.params.id
      ) {
        user = await User.findByIdAndUpdate(
          req.params.id,
          { $set: modifications },
          { new: true }
        );
        if (user.desactivated === true) {
          user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true }
          );
        } else {
          user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: true } },
            { new: true }
          );
        }
        res.json(user);
      }
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({
          msg: 'User not found'
        });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/users/:id
// @desc    Update a User
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 }),
      sanitizeBody('name')
        .trim()
        .escape()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);

    let errorArray = errors.array();

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errorArray[0].msg);
    }

    const modifications = {};
    (modifications.user = req.params.id),
      (modifications.name = req.body.name),
      (modifications.password = req.body.password);
    const salt = await bcrypt.genSalt(10);
    modifications.password = await bcrypt.hash(modifications.password, salt);

    try {
      const authHeader = req.get('x-auth-token');
      const decoded = jwt.verify(authHeader, config.get('jwtToken'));
      userAuth = decoded.user;

      if (userAuth.id != req.params.id && userAuth.role != 'admin') {
        return res.status(401).json({
          msg: 'User not authorized'
        });
      } else if (
        (userAuth.id != req.params.id && userAuth.role === 'admin') ||
        userAuth.id === req.params.id
      ) {
        user = await User.findByIdAndUpdate(
          req.params.id,
          { $set: modifications },
          { new: true }
        );
        res.json(user);
      }

      console.log('req.user', req.user);
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({
          msg: 'User not found'
        });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    //console.log('lol', req);
    if (req.user.role === 'admin') {
      const users = await User.find()
        .select('-password -passwordSetToken -passwordSetExpires -__v -date')
        .populate('store')
        .populate('country')
        .populate('region')
        .sort({ date: -1 });
      res.json(users);
    } else if (req.user.role === 'country') {
      await User.find()
        .populate('store')
        .populate('country')
        .populate('region')
        .select('-password -passwordSetToken -passwordSetExpires -__v -date')
        .exec((err, data) => {
          data = data.filter(item =>
            (item.country &&
              item.country._id == req.session.user.country.toString()) ||
            (item.region &&
              item.region.country == req.session.user.country.toString()) ||
            (item.store &&
              item.store.country == req.session.user.country.toString())
              ? item
              : null
          );
          res.json(data);
        });
    } else if (req.user.role === 'region') {
      console.log(req.session.user.region);
      await User.find()
        .populate('store')
        .populate('country')
        .populate('region')
        .select('-password -passwordSetToken -passwordSetExpires -__v -date')
        .exec((err, data) => {
          data = data.filter(item =>
            (item.region &&
              item.region._id == req.session.user.region.toString()) ||
            (item.store &&
              item.store.region == req.session.user.region.toString())
              ? item
              : null
          );
          res.json(data);
        });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/users/:id
// @desc    Get a user by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id)
      .populate('store')
      .populate('country')
      .populate('fullname')
      .populate('region')
      .select('-password -passwordSetToken -passwordSetExpires -__v -date');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (req.user.role !== 'admin' && user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user.role !== 'admin' && user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await user.remove();

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
