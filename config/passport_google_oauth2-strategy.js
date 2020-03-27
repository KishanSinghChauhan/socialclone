const passport = require('passport');
const googleStrategy  =require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID:"1077906255628-eb8nq8gb1b73i4duf8j2m2sogv2lklh6.apps.googleusercontent.com",
    clientSecret:"DEzwGg7GLIWIytnrmFaW8P1W",
    callbackURL:"http://localhost:8005/users/auth/google/callback",
},
function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in google auth',err);
            return
        }
        console.log(profile);
        if(user){
            return done(null,user);
        }else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log('error on creating user google auth',err);
                    return
                }
                return done(null,user);
            })
        }
    })
}
))

module.exports = passport;