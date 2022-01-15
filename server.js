//allows us to use env variables from .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose')
const memoRouter = require('./routes/memos')
const Memo = require('./models/memo')
const methodOverride = require('method-override')
const app = express()

mongoose.connect(process.env.DATABASE_URL) //, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.error('Connected to mongoose'))


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))



app.get('/', async (req,res) => {
    const memos = await Memo.find().sort({
        createdAt: 'desc'
    })

    res.render('memos/index', {memos: memos })
})

app.use('/memos',memoRouter)

app.listen(5000)
