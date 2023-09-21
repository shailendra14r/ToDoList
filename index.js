const express = require('express');
const ejs = require('ejs');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
// const fs = require('fs');

// Getting values of key
// const privateKey = fs.readFileSync('./private.key','utf-8');
const privateKey = dotenv.PRIVATE_KEY
// const publicKey = fs.readFileSync('./public.key','utf-8');
const publicKey = dotenv.PUBLIC_KEY

// Basic
const app = express();
app.set('view engine','ejs');

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.resolve(__dirname,'./public')));

// Database Connection
const dbConnection = async (req,res)=>{
    await mongoose.connect(process.env.TEST_URL);
    console.log('DATABASE CONNECTED');
}
dbConnection().catch(err=> console.log(err));


// Schema
const userSchema = new Schema({
    name : {type:String, required:true},
    email : {type:String, required:true, unique:true},
    password: {type:String, required:true},
    token: {type:String},
    notes: [Object]
});

// Model
const User = mongoose.model('User',userSchema);

// Route --> Sign Up
app.post('/signup',(req, res)=>{
    // Getting User data from body
    const user = new User(req.body);

    // Saving user and rendering home page
    const userSave = async(hash)=>{

        user.password = hash;

        // Making user token
        const token = jwt.sign({email: user.email}, privateKey, { algorithm: 'RS256' });
        user.token = token;

        // Saving user
        await user.save();

        // Rendering Page
        ejs.renderFile(path.resolve(__dirname,'./views/home.ejs'),{name:user.name, notes: user.notes},(error, str)=>{
            res.cookie('token', token).send(str);
        });

    }
    // hasing password function
    bcrypt.hash(req.body.password, +process.env.SALTROUNDS, (error, hash)=>{
        userSave(hash).catch(err=>console.log(err));
    });
});

// Route --> Sign In
app.post('/signin',async (req, res)=>{
    // Getting email
    const userEmail = req.body.email;
    // Finding User generating new token and rendering home page
    try{
        // Checking valid email
        const dbUser = await User.findOne({email:userEmail});
        if(dbUser)
        {
            // Checking Password
            bcrypt.compare(req.body.password, dbUser.password, function(err, result) {

                // Password Matched
                if(result===true){
                    // Assigning new token
                    const token = jwt.sign({email: dbUser.email}, privateKey, { algorithm: 'RS256' });
                    dbUser.token = token;

                    // Rendering new Page
                    ejs.renderFile(path.resolve(__dirname,'./views/home.ejs'),{name:dbUser.name, notes: dbUser.notes},(error, str)=>{
                        res.cookie('token', token).send(str);
                    });

                }

                // Password note Matched
                else{

                    // rendering password note matched page
                    res.render(path.resolve(__dirname,'./views/index.ejs'));
                }
            });
        }
        // Email not found
        else{
            // rendering email not found page
            console.log('error');
            res.render(path.resolve(__dirname,'./views/index.ejs'));
        }
    }
    // Any other error will be catched here
    catch(error){
            res.render(path.resolve(__dirname,'./views/index.ejs'));
    }

});

// Authentication Middleware
const auth = function(req, res, next){
    try{
        // Getting token
        const token = req.cookies.token;

        // Verifying token
        jwt.verify(token, publicKey, function(err, decoded) {
            // Setting and printing decoded info. 
            res.locals.user = decoded;

            // cheching for valid decoded info.
            if(decoded==null)
                // Rendering old page
                res.render(path.resolve(__dirname,'./views/index.ejs'));

            else
                // Sending further
                next();
        });
    }
    // No token in cookies
    catch(error){
        console.log(error);
        res.render(path.resolve(__dirname,'./views/index.ejs'));
    }
}

// Home page direct link
app.get('/home', auth, async(req, res)=>{
    // Finding User
    const user = await User.findOne({email:res.locals.user.email});
    
    // Rendering home page
    ejs.renderFile(path.resolve(__dirname,'./views/home.ejs'), {name:user.name, notes:user.notes}, (error, str)=>{
        res.send(str);
    });
});


// Req. to add user note
app.patch('/addnote', auth, async(req, res)=>{
    const note = req.body;

    // getting user and setting note
    const user = await User.findOne({email:res.locals.user.email});
    const notes = user.notes;
    notes.push(note);
    let newUser = await User.findOneAndUpdate({email:res.locals.user.email},{notes:notes},{new:true});

    // RAndom
    res.json({'status':'list Updated'});
});


// Req. to delete user note
app.patch('/dltnote', auth, async(req, res)=>{
    const note = req.body;

    // getting user and setting note
    // // // cannot compare two objects directly
    const user = await User.findOne({email:res.locals.user.email});
    const notes = user.notes;
    const noteIndex = notes.findIndex(p=>JSON.stringify(p)===JSON.stringify(note));
    notes.splice(noteIndex,1);
    let newUser = await User.findOneAndUpdate({email:res.locals.user.email},{notes:notes},{new:true});

    // RAndom
    res.json({'status':'list Updated'});
});

app.get('/logout', auth, (req, res)=>{
    res.clearCookie('token').render(path.resolve(__dirname,'./views/index.ejs'));
});

app.listen(process.env.PORT,()=>{
    console.log('Server Started');
})
        
