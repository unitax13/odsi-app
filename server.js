//allows us to use env variables from .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose')
const memoRouter = require('./routes/memos')
const Memo = require('./models/memo')
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express()

//passport config
require('./config/passport')(passport);


// DB config
const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
.then( () => console.log('mongodb connected'))
.catch(err => console.log(err));


app.use(methodOverride('_method'))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// app.get('/dashboard', async (req,res) => {
//     const memos = await Memo.find().sort({
//         createdAt: 'desc'
//     })

//     res.render('memos/index', {memos: memos })
// })




//Routes
app.use('/', require('./routes/index'))

app.use('/users', require('./routes/users'))
app.use('/register', require('./routes/users'))
app.use('/memos',memoRouter)

app.listen(process.env.PORT || 5000)
