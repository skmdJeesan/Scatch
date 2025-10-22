const express =  require('express')
const app = express()

const db = require('./config/mongoose-connection')
const userModel = require('./models/user-model')
const ownerModel = require('./models/owner-model')
const productModel = require('./models/product-model')

const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')


const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
const cookieParser = require('cookie-parser')
//const upload = require('./config/multerconfig')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

app.listen(3000)