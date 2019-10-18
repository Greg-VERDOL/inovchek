const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const config = require('config');
const api = config.get('API-Sendgrid');

const auth = require('../../middleware/auth');
const acl = require('../../middleware/acl/acl');

const Operator = require('../../models/Operator');
const User = require('../../models/User');
const Token = require('../../models/Token');

sgMail.setApiKey(api);

// @route   POST api/operators
// @desc    Create an operator
// @access  Private
router.post(
  '/',
  [
    auth,
    acl.authorize,
    [
      check('firstName', 'First Name is required')
        .not()
        .isEmpty(),
      check('lastName', 'lastName is required')
        .not()
        .isEmpty(),
      check('role', 'Role is required')
        .not()
        .isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      sanitizeBody('firstName')
        .trim()
        .escape(),
      sanitizeBody('lastname')
        .trim()
        .escape(),
      sanitizeBody('role')
        .trim()
        .escape(),
      sanitizeBody('email')
        .trim()
        .escape()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select();

      const password = crypto.randomBytes(16).toString('hex');

      const newOperator = new Operator({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        email: req.body.email,
        createdBy: user.email,
        user: req.user.id
      });

      // Save to the DB
      const operator = await newOperator.save();

      res.json(operator);

      next();

      const token = new Token({
        _id: operator.id,
        token: crypto.randomBytes(16).toString('hex')
      });

      req.body.passwordSetToken = token.token;
      req.body.passwordSetExpires = moment().add(12, 'hours');
      req.body.password = password;

      (operator.passwordSetToken = req.body.passwordSetToken),
        (operator.passwordSetExpires = req.body.passwordSetExpires),
        (operator.password = req.body.password),
        // Save to the DB
        operator.save();
      token.save();

      // Send email

      const msg = {
        to: operator.email,
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
                                                    <div style="text-align: center;"><a href="http://localhost:5000/operators/set/${
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
      sgMail.send(msg);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   PUT api/operators/:id
// @desc    Update an operator
// @access  Private
router.put(
  '/:id',
  [
    auth,
    acl.authorize,
    [
      check('firstName', 'First Name is required')
        .not()
        .isEmpty(),
      check('lastName', 'lastName is required')
        .not()
        .isEmpty(),
      check('role', 'Role is required')
        .not()
        .isEmpty(),
      check('email', 'Please include a valid email')
        .isEmail()
        .custom(),
      sanitizeBody('firstName')
        .trim()
        .escape(),
      sanitizeBody('lastname')
        .trim()
        .escape(),
      sanitizeBody('role')
        .trim()
        .escape(),
      sanitizeBody('email')
        .trim()
        .escape()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const modifications = {};
    (modifications.operator = req.params.id),
      (modifications.firstName = req.body.firstName),
      (modifications.lastName = req.body.lastName),
      (modifications.role = req.body.role),
      (modifications.email = req.body.email);

    try {
      const operator = await Operator.findByIdAndUpdate(
        req.params.id,
        { $set: modifications },
        { new: true }
      );
      if (operator.user.id.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'User not authorized'
        });
      }
      res.json(operator);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Operator not found'
        });
      }
      res.status(500).send('Server Error 😞');
    }
  }
);

// @route   GET api/operators
// @desc    Get all operators
// @access  Private
router.get('/', auth, acl.authorize, async (req, res) => {
  try {
    const operators = await Operator.find({ user: req.user.id })

      .populate('user')
      .sort({ date: -1 });

    res.json(operators);
    console.log(req.params);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

// @route   GET api/operators/:id
// @desc    Get an operator by ID
// @access  Private
router.get('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id).populate('user');

    if (!operator) {
      return res.status(404).json({ msg: 'Operator not found' });
    }
    if (operator.user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(operator);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Operator not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   DELETE api/operators/:id
// @desc    Delete an operator
// @access  Private
router.delete('/:id', auth, acl.authorize, async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id);

    if (!operator) {
      return res.status(404).json({ msg: 'Operator not found' });
    }

    if (operator.user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await operator.remove();

    res.json({ msg: 'Operator removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Operator not found' });
    }
    res.status(500).send('Server Error 😞');
  }
});

// @route   POST api/operators/set-password/:token
// @desc    Set password for an operator
// @access  Public
router.post('/set/:token', async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      return res.status(404).json({
        msg: 'This token is not valid. Your token my have expired.'
      });
    }

    const operator = await Operator.findById(token._id);
    if (!operator) {
      return res.status(404).json({
        msg: 'We were unable to find an operator for this token.'
      });
    }

    if (operator.passwordSetToken !== token.token) {
      return res.status(404).json({
        msg: `Operator token and your token didn't match. You may have a more recent token in your mail list.`
      });
    }

    if (moment().utcOffset(0) > operator.passwordSetExpires) {
      return res.status(404).json({
        msg: 'Token has expired.'
      });
    }
    const password = req.body.password;

    operator.password = password;
    // operator.passwordSetToken = '';
    // operator.passwordSetExpires = moment().utcOffset(0);

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);

    operator.password = await bcrypt.hash(password, salt);

    operator.save();
    res.json(operator);

    const payload = {
      operator: {
        id: operator.id,
        role: operator.role
      }
    };

    jwt.sign(
      payload,
      config.get('jwtToken'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
        console.log({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error 😞');
  }
});

module.exports = router;
