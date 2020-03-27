const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const port = 8005;

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const passportJWT = require('./config/passport_jwt_strategy');
const passportGoogle = require('./config/passport_google_oauth2-strategy');


const MongoStore = require('connect-mongo')(session);

//for sass middleware

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

// extract styles and scripts from sub pages into the layouts

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name:'codeial',
    secret:'something',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)//how much time cookie stored in the browser
    },// mongo store is used to store the session cookie in the db
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok')
        })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
// use express router

app.use('/', require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`server is running on port : ${port}`);

});