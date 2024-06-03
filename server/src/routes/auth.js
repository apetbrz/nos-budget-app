const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/worker');
const validator = require('validator')

//auth.js: handles authenticating users

//register: register a user 
router.post('/register', async (req, res) => {
    //grab username, email, password
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    //if any are empty, or the email is not an email, return an error message
    if(!username || !email || !password || !validator.isEmail(email)) {
        return res.status(400).send({err: 'invalid-username-email-password'});
    }

    //at this point, username/email/password should be valid (TODO: PASSWORD SECURITY CHECK (length/etc))
    //hash the password
    bcrypt.hash(password, 16, (err, hash) => {
        
        //add the user to the database
        db.addUser(
            { username, email, password: hash }, 
            (success, err) => {
                if(err) return res.status(400).send({err});
                if(success){
                    let token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 86400 });
                    return res.send({token});
                }
            }
        );
    })
});

//login: log an existing user in
router.post('/login', (req, res) => {
    //grab the email, password
    let email = req.body.email;
    let password = req.body.password;

    //check database for user
    db.findUserByEmailForVerification(email, (err, user) => {
        
        //if an error happened, send back an error
        if(err) return res.status(500).send({err: 'an oopsie happened, im working on it :P'});
        //if the user was not found, send back an error
        else if(!user) return res.status(401).send({err: "incorrect credentials"});
        
        //otherwise, check the password against the hashed password in the database
        bcrypt.compare(password, user.password, (err, result) => {
            
            //if check failed, send back an error
            if(!result) return res.status(401).send({err: "incorrect credentials"});

            //otherwise, success! generate and send a token
            let token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 86400 });
            return res.send({token});

        });
    });

});

//user-query: grab data about the user, from token
router.post('/user-query', (req, res) => {
    //get the token
    let token = req.body.token;

    //verify that it is valid
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        
        //if not valid, send back an error
        if(err) return res.status(401).send({err: "invalid token"});

        //if valid, find the user by email
        db.findUserByEmailForClient(decoded.id, (err, userdata) => {
        
            //if an error happened, send back an error
            if(err) return res.status(500).send({err: 'an oopsie happened, im working on it :P'});
            //if the user wasnt found, send back an error
            if(!userdata) return res.status(401).send({err: "user not found"});
            //if found, send back the user data
            return res.send(userdata);
        });
    });
});

module.exports = router;