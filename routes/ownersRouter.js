const express = require('express')
const router = express.Router()
const ownerModel = require('../models/owner-model')
const isloggedin = require('../middlewares/isLoggedin')

if(process.env.NODE_ENV === 'development') {
  router.post('/create', async (req,res) => {
    let owners = await ownerModel.find()
    if(owners.length > 0) res.status(504).send("you can't be owner!")
    let {fullname, email, password} = req.body
    let createdOwner = await ownerModel.create({fullname, email, password})
    res.status(201).send(createdOwner)
  })
}

router.get('/admin', isloggedin, (req,res) => {
  let success = req.flash("success")
  res.render("createproducts", {success})
})

module.exports = router