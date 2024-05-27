const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('nos-db.sqlite');
const authTableName = "auth";
const dataTableName = "data";

db.serialize(() => {
    console.log("creating db table");
    db.run(`CREATE TABLE IF NOT EXISTS ${authTableName} (email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, username TEXT NOT NULL, uuid BLOB UNIQUE NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS ${dataTableName} (uuid BLOB UNIQUE NOT NULL, jsondata TEXT NOT NULL)`);
});

const addUser = async function(data){
    if(!data.username || !data.email || !data.password){
        return Promise.reject(new Error("invalid user data"));
    }else{
        return db.run(`INSERT INTO ${authTableName} (email, password, username) VALUES ('${data.email}', '${data.password}', '${data.username}')`, () => {
            console.log(`user added: ${data.email}`)   
        });
    }
}

const findUserByEmailForVerification = async function(query, callback){
    sql = `SELECT * FROM ${authTableName} WHERE email='${query}'`;
    return db.get(sql, (err, row) => {
        if(err){
            console.log(err);
            if(callback) callback(err, null);
        }
        else if(callback) callback(null, row);
        return row !== undefined;
    });
}
const findUserByEmailForClient = async function(query, callback){
    sql = `SELECT email, username FROM ${authTableName} WHERE email='${query}'`;
    return db.get(sql, (err, row) => {
        if(err){
            console.log(err);
            if(callback) callback(err, null);
        }
        else if(callback) callback(null, row);
        return row !== undefined;
    });
}

module.exports = {
    db,
    addUser,
    findUserByEmailForVerification,
    findUserByEmailForClient
}