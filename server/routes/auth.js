const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/worker');

router.post('/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.status(422).send(JSON.stringify({
            err: 'invalid-email-password'
        }));
    }

    bcrypt.hash(password, 16, (err, hash) => {
        
        db.addUser({email, password: hash}).then(() => {
            
            let token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 86400 });
            return res.send({token});

        }).catch((err) => {
            return res.status(500).send({err: 'an oopsie happened, im working on it :P'});
        });
    })
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    db.findUserByEmail(email, (err, user) => {
        
        if(err) return res.status(500).send({err: 'an oopsie happened, im working on it :P'});
        else if(!user) return res.status(401).send(JSON.stringify({err: "incorrect credentials"}));
        
        bcrypt.compare(password, user.password, (err, result) => {
            
            if(!result) return res.status(401).send(JSON.stringify({err: "incorrect credentials"}));
            let token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 86400 });
            return res.send({token});

        });
    })

});

module.exports = router;