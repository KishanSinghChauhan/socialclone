  const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


//authenticate using passport

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},
function(req,email,password,done){
    //find user and establish the identity
    User.findOne({email:email},function(err,user){
        if(err){
            req.flash('error',err);
            console.log('error in finding user --> passport');
            return
        }

        if(!user || user.password != password){

            req.flash('error','Invalid username /password');
            return done(null,false);
        }
        return done(null,user);
    });
}
));

//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in the the pass on the request to the next function
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

//serializing the user to decide which key is to kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});



//deserializing the user from the key in the cookies

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user --> passport');
            return done(err);
        }
        return done(null,user);
    });
});


module.exports = passport;