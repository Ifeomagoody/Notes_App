require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')

const app = express()

const port = 5000 || process.env.PORT

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true, 
    store: MongoStore.create({
        mongourl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: new Date (Date.now() + (3600000) ) } //for 7 days 604800000
}));






app.use(passport.initialize())
app.use(passport.session())


app.use(express.urlencoded({extended: true}))
app.use(express.json()) //this helps to pass data for the POST or PUT action
app.use(methodOverride("_method"))



//this is where the database connection is done
connectDB();



//Creation of the static files
app.use(express.static('public'))

//for the templating engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')




//Routes
app.use('/', require('./server/routes/'))
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/dashboard'))

//this is where status 404 is handled
app.get('*', function(req, res) {
   // res.status(404).send('404 page not found.')
    res.status(404).render('404')
})

app.listen(port, () => {
    console.log( `App listening on port ${port}` )
})






