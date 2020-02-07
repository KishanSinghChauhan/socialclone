const User = require('../models/user');
const path= require('path');
const fs = require('fs');


module.exports.profile = function(req,res){
   
    User.findById(req.params.id ,function(err,user){
            
        return res.render('user_profile',{
            title:"User Profile",
            profile_user:user
        });
    });
}

module.exports.update = async function(req,res){
      //     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            
//         return res.redirect('back');

//     });
// }else{
//     return res.status(401).send('Unauthorized');
// }
// }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('multer Error',err);
                }
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' +req.file.filename
                }
                user.save();
                return res.redirect('back');

            });

        }catch{
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        return res.status(401).send('Unauthorized');
    }
}


// render the signup page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

// render the sign page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}


//get the sign up data
module.exports.create = function(req,res){
  
    if(req.body.password!= req.body.confirm_password){
        return res.redirect('back');

    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('error in finding user in signing up'); return}

        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error in creating user while sign up'); return
                }
                return res.redirect('/users/sign-in');

            })
        }else{
            return res.redirect('back');
        }   
    });
}

//sign in and create session by passport.js
module.exports.createSession = function(req,res){
    req.flash('success','logged in successfully');
    return res.redirect('/');
}


module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','logged out successfully');

    return res.redirect('/');
}

//get the sign in data

// module.exports.createSession = function(req,res){
//    User.findOne({email : req.body.email},function(err,user){
//        if(err){
//            console.log('error in finding user in sign in'); return
//        }
//        if(user){
//            if(user.password !=req.body.password){
//                return res.redirect('back');
//            }
//            res.cookie('user_id',user.id);
//            return res.redirect('/users/profile');
//        }else{
//            return res.redirect('back');
//        }
//    });
// }

