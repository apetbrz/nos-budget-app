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
        db.addUser({email, password: hash}).then((token) => {
            return res.send(JSON.stringify(token));
        }).catch((err) => {
            return res.status(500).send(err);
        });
    })
});

module.exports = router;