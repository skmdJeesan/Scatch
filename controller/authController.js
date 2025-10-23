const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/generateToken')

module.exports.registerUser = async (req,res) => {
  try {
    let {fullname, email, password} = req.body
    let user = await userModel.findOne({email})
    if(user) return res.status(401).send('you already have an account, please log in.')
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(password, salt, async (err,hash) => {
        if(err) res.send(err.message)
        else {
          let user = await userModel.create({fullname, email, password: hash})
          let token = generateToken(user)
          res.cookie("token", token)
          res.redirect("/shop")
        }
      })
    })
  } catch(err) { res.send(err.message)}
}

module.exports.loginUser = async (req,res) => {
  try {
    let {email, password} = req.body
    let user = await userModel.findOne({email})
    if(!user) return res.status(401).send('user not found')
    bcrypt.compare(password, user.password, (err,result) => {
      if(result){
        let token = generateToken(user)
        res.cookie('token', token)
        res.redirect('/shop')
      } else {
        res.status(401).send('user not found')
      }
    })
  } catch(err) { res.send(err.message)}
}

module.exports.logoutUser = async (req,res) => {
  res.cookie('token', '')
  res.redirect('/')
}