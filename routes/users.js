const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

//User model
const User = require('../models/User');
const passport = require('passport')



//Login Page
router.get('/login', (req, res) => {
    res.render("login");
})


// //Login Page
// router.get('/register', (req, res) => {
//     res.render("register");
// })

// // register handle
// router.post('/register', (req,res) => {
//     const { name, email, password, password2 } = req.body;
//     let errors = [];

//     //check required fields
//     if (!name || !email || !password || !password2) {
//         errors.push({ msg: "Please fill in all fields"});
//     }

//     // check password match
//     if(password !== password2) {
//         errors.push ({msg: 'Passwords do not match'});
//     }

//     //check pass length
//     if (password.length < 4) {
//         errors.push({msg: "Password should have at least 4 characters"});
//     }


//     if (errors.length > 0) {
//         res.render('register', {
//             errors,
//             name,
//             email,
//             password,
//             password2
//         })
//     } else {
//         // validation passes
//         User.findOne({ email: email})
//         .then(user => {
//             if (user) {
//                 //user exists
//                 errors.push({msg: "E-mail is already taken"});
//                 res.render('register', {
//                     errors,
//                     name,
//                     email,
//                     password,
//                     password2
//                 });
//             } else {
//                 const newUser = new User({
//                     name,
//                     email,
//                     password
//                 });

//                 //Hash password
//                 bcrypt.genSalt(10, (err, salt) => {
//                     bcrypt.hash(newUser.password, salt, (err, hash) => {
//                         if (err) throw err;
//                         // Set password to hashed
//                         newUser.password = hash;
//                         //Save user
//                         newUser.save()
//                         .then(user => {
//                             req.flash('success_message', 'You are now registered and can log in');
//                             res.redirect('/users/login')
//                         })
//                             .catch(err => console.log(err))

//                     })
//                 })
//             }
//         })
//     }
// });

//Login handle
router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});


//logout handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;