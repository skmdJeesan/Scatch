const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const bcrypt = require('bcrypt');
const isloggedin = require('../middlewares/isLoggedin');

const SALT_ROUNDS = 10;

// Register (only one owner allowed)
// router.post('/owners/create', async (req, res) => {
//   try {
//     const owners = await ownerModel.find();
//     if (owners.length > 0) return res.status(403).send("you can't be owner!");

//     const { email, password } = req.body;
//     const hash = await bcrypt.hash(password, SALT_ROUNDS);
//     const owner = await ownerModel.create({ email, password: hash });

//     // set session so user is logged in
//     req.session.user = { id: owner._id, email: owner.email, role: 'owner' };
//     req.flash('success', "Owner created and logged in.");
//     return res.redirect('/admin');
//   } catch (err) {
//     //console.error(err);
//     req.flash('error', 'Server error');
//     return res.redirect('/owners/login');
//   }
// });

// Login route (form should POST to this)
router.post('/owners/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/owners/login');
    }

    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/owners/login');
    }

    // set session
    req.session.user = { id: owner._id, email: owner.email, role: 'owner' };
    req.flash('success', 'Logged in');
    return res.redirect('/owners/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error');
    return res.redirect('/owners/login');
  }
});

router.get('/admin', isloggedin, (req, res) => {
  const success = req.flash("success");
  res.render("createproducts", { success });
});

router.get('/login', (req, res) => {
  res.render("owner-login", { loggedin: false });
});

module.exports = router;
