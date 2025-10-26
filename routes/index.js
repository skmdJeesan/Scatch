const express = require('express')
const router = express.Router()
const isloggedin = require('../middlewares/isLoggedin')
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')

router.get('/', (req,res) => {
  let error = req.flash('error')
  res.render("index", {error, loggedin: false})
})

router.get('/shop', isloggedin, async (req,res) => {
  let products = await productModel.find()
  let success = req.flash('success')
  let info = req.flash('info')
  res.render("shop", {products, success, info})
})

router.get('/cart', isloggedin, async (req,res) => {
  let user = await userModel.findOne({email: req.user.email}).populate('cart')
  let success = req.flash('success')
  res.render("cart", {user, success})
})

router.get('/addtocart/:productid', isloggedin, async (req, res) => {
  try {
    const productId = req.params.productid;
    const user = await userModel.findOne({ email: req.user.email });
    // if (!user) {
    //   req.flash('error', 'User not found');
    //   return res.redirect('/login');
    // }

    // compare as strings (works if cart stores strings or ObjectIds)
    const already = user.cart.some(p => p.toString() === productId);
    if (already) {
      req.flash('info', 'Already added to cart');
      return res.redirect('/shop');
    }

    user.cart.push(productId);
    await user.save();

    req.flash('success', 'Added to Cart');
    res.redirect('/shop');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error — try again');
    res.redirect('/shop');
  }
});

router.get('/removefromcart/:productid', isloggedin, async (req,res) => {
  try {
    const id = req.params.productid;
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).send('user not found');

    const idx = user.cart.findIndex(product => product._id.toString() === id);
    if (idx === -1) return res.status(404).send('product not found');

    user.cart.splice(idx, 1);        // remove the item in-place
    await user.save();

    req.flash('success', 'Removed from Cart');
    res.redirect('/cart');
  } catch (err) {
    //console.error(err);
    res.status(500).send('Server error');
  }
})

router.post('/order', isloggedin, (req,res) => {
  res.send('ordered placed successfully🎉')
})

module.exports = router