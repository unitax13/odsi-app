const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

//Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email' }, (email, password, done) => {
                // match User
                // checking data with nagative attitude
                const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                
                if (email.length > 64) {
                    console.log('Very long email out there')
                    return done (null, false, {message: 'Incorrect credentials'})

                } else if (password.length < 4 || password.length > 32) {
                    console.log('Password is too long or too short')
                    return done (null, false, {message: 'Incorrect credentials'})
                }
                else if (!re.test(email)) {
                    console.log("Email doesn't look like email")
                    return done (null, false, {message: 'Incorrect credentials'})

                } else { //if nothing weird out there

                    User.findOne({ email: email })
                    .then(user => {
                        if (!user) {
                            return done(null, false, {message : 'Incorrect credentials'});
                        }

                        //Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) throw err;

                            if(isMatch) {
                                return done(null, user);
                            } else {
                            return done (null, false, {message: 'Incorrect credentials'})
                            }

                        });
                    })
                    .catch (err => console.log(err))

                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}