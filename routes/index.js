const express = require('express');

const router = express.Router();
const Memo = require('../models/memo')

const {ensureAuthenticated} = require('../config/auth')

//welcome page

router.get('/', (req, res) => {
    res.render('welcome');
})

//dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
        const memos = await Memo.find().sort({
        createdAt: 'desc'
    })
    res.render('memos/index', {memos: memos });
})

module.exports = router;