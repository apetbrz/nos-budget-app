const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('nos-db.sqlite');

db.serialize(() => {
    console.log("creating db table");
    db.run("CREATE TABLE IF NOT EXISTS users (email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, feed TEXT NOT NULL)");

    db.each("SELECT rowid AS id, info FROM users", (err, row) => {
        if(row !== undefined) console.log(row.id + ": " + row.info);
    });
});

const addUser = async function(data){
    if(!data.email || !data.password){
        return Promise.reject(new Error("invalid user data"));
    }else{
        db.run(`INSERT INTO users (email, password, feed) VALUES ('${data.email}', '${data.password}', 'TEST')`, () => console.log(`user added: ${data.email}`));

        db.each("SELECT email AS id, info FROM users", (err, row) => {
            if(row !== undefined) console.log(row.id + ": " + row.info);
        });

        let token = jwt.sign({ id: data.email }, process.env.SECRET, { expiresIn: 86400 });

        return token;
    }
}

module.exports = {
    db,
    addUser
}