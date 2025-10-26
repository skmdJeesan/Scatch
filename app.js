const express =  require('express')
const app = express()

require('dotenv').config()
require('./config/mongoose-connection')

const indexRouter = require('./routes/index')
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')

const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const config = require('config')
const flash = require('connect-flash')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || `${config.get('MONGODB_URI')}/scatchDb`,
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash())

app.use('/', indexRouter)
app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

const port = process.env.PORT || 3000; // Always use the PORT env variable provided by Render
app.listen(port, '0.0.0.0', () => { // Bind to 0.0.0.0 to accept connections from outside
    console.log(`Server is running on port ${port}`);
});