const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/worker');
const validator = require('validator')

router.post('/register', async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    if(!username || !email || !password || !validator.isEmail(email)) {
        return res.status(422).send(JSON.stringify({
            err: 'invalid-user-email-password'
        }));
    }

    if(db.findUserByEmailForVerification(email)){
        return res.status(422).send(JSON.stringify({
            err: 'user-already-exists'
        }));
    }

    bcrypt.hash(password, 16, (err, hash) => {
        
        db.addUser({username, email, password: hash}).then(() => {
            
            let token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 86400 });
            return res.send({token});

        }).catch((err) => {
            console.log(err);
            return res.status(500).send(JSON.stringify({err: 'an oopsie happened, im working on it :P'}));
        });
    })
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    db.findUserByEmailForVerification(email, (err, user) => {
        
        if(err) return res.status(500).send(JSON.stringify({err: 'an oopsie happened, im working on it :P'}));
        else if(!user) return res.status(401).send(JSON.stringify({err: "incorrect credentials"}));
        
        bcrypt.compare(password, user.password, (err, result) => {
            
            if(!result) return res.status(401).send(JSON.stringify({err: "incorrect credentials"}));
            let token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 86400 });
            return res.send({token});

        });
    });

});

router.post('/user-query', (req, res) => {
    let token = req.body.token;

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        
        if(err) return res.status(401).send(JSON.stringify({err: "invalid token"}));

        db.findUserByEmailForClient(decoded.id, (err, user) => {
        
            if(err) return res.status(500).send(JSON.stringify({err: 'an oopsie happened, im working on it :P'}));
            if(!user) return res.status(401).send(JSON.stringify({err: "user not found"}));

            return res.send(user);
        });
    });

});

module.exports = router;