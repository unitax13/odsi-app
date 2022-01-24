const express = require('express')
const Memo = require('../models/memo')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

router.get('/new', ensureAuthenticated, (req,res) => {
    res.render('memos/new' , {memo: new Memo()})
})

router.get('/edit/:id', ensureAuthenticated, async (req,res) => {
    const memo = await Memo.findById(req.params.id)
    res.render('memos/edit' , {memo: memo})
})

router.get('/:id', ensureAuthenticated, async (req,res) => {
    const memo = await Memo.findById(req.params.id) 
    if (memo==null) { 
        res.redirect('/')
    }
    res.render('memos/show', {memo: memo })
})

router.post('/', ensureAuthenticated, async (req, res, next) => {
    req.memo = new Memo()
    next()
}, saveMemoAndRedirect('new'))

router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    req.memo = await Memo.findById(req.params.id)
    next()
}, saveMemoAndRedirect('edit'))

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    await Memo.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard')
})

function saveMemoAndRedirect(path) {
    return async (req, res) => {
        let memo = req.memo    
        memo.title =  req.body.title
        memo.description = req.body.description
        memo.markdown = req.body.markdown    
        try {
           memo = await memo.save() //this is gonna give us an id for an article
           res.redirect(`/memos/${memo.id}`)
        } catch (e) {
            console.log(e)
            res.render(`memos/${path}`, {memo: memo})
        }
    }
}

module.exports = router