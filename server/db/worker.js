const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('nos-db.sqlite');
const authTableName = "users";

db.serialize(() => {
    console.log("creating db table");
    db.run(`CREATE TABLE IF NOT EXISTS ${authTableName} (email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, feed TEXT NOT NULL)`);

    db.each("SELECT rowid AS id, info FROM users", (err, row) => {
        if(row !== undefined) console.log(row.id + ": " + row.info);
    });
});

const addUser = async function(data){
    if(!data.email || !data.password){
        return Promise.reject(new Error("invalid user data"));
    }else{
        db.run(`INSERT INTO ${authTableName} (email, password, feed) VALUES ('${data.email}', '${data.password}', 'TEST')`, () => {
            console.log(`user added: ${data.email}`)
        });
        return;
    }
}

const findUserByEmail = async function(query, callback){
    sql = `SELECT * FROM ${authTableName} WHERE email='${query}'`;
    db.get(sql, (err, row) => {
        if(err){
            console.log(err);
            callback(err, null);
        }
        else callback(null, row);
    });
}

module.exports = {
    db,
    addUser,
    findUserByEmail
}