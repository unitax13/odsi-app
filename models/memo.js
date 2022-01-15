const mongoose = require('mongoose')
const {marked} = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
//dompurify documentation

const memoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    markdown: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: () => Date.now() //Date.now
    },
    sanitizedHTML: {
        type: String,
        required: true
    }
})

memoSchema.pre('validate', function(next) {

    if (this.markdown) {
        this.sanitizedHTML = dompurify.sanitize(marked.parse(this.markdown))
    }

    next()
})

module.exports = mongoose.model('Memo', memoSchema)