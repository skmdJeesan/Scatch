const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const isloggedin = require('../middlewares/isLoggedin');
const {generateToken} = require('../utils/generateToken')

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
router.post('/login', async (req, res) => {
  try {
    let {email, password} = req.body
    let owner = await userModel.findOne({email})
    if(!owner) return res.status(401).send('user not found')
    bcrypt.compare(password, owner.password, (err,result) => {
      if(result){
        let token = generateToken(owner)
        res.cookie('token', token)
        res.redirect('/owners/admin')
      } else {
        res.status(401).send('user not found')
      }
    })
  } catch(err) { res.send(err.message)}
});

router.get('/admin', isloggedin, (req, res) => {
  const success = req.flash("success");
  res.render("createproducts", { success });
});

router.get('/login', (req, res) => {
  res.render("owner-login", { loggedin: false });
});

module.exports = router;
