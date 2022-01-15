const express = require('express')
const Memo = require('../models/memo')
const router = express.Router()

router.get('/new', (req,res) => {
    res.render('memos/new' , {memo: new Memo()})
})

router.get('/edit/:id', async (req,res) => {
    const memo = await Memo.findById(req.params.id)
    res.render('memos/edit' , {memo: memo})
})

router.get('/:id', async (req,res) => {
    const memo = await Memo.findById(req.params.id) 
    if (memo==null) { 
        res.redirect('/')
    }
    res.render('memos/show', {memo: memo })
})

router.post('/', async (req, res, next) => {
    req.memo = new Memo()
    next()
}, saveMemoAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.memo = await Memo.findById(req.params.id)
    next()
}, saveMemoAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Memo.findByIdAndDelete(req.params.id)
    res.redirect('/')
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