const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('nos-db.sqlite');
const authTableName = "auth";
const dataTableName = "data";

//initialize the database:
db.serialize(() => {
    console.log("creating db table");
    db.run(`CREATE TABLE IF NOT EXISTS ${authTableName} (email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, username TEXT NOT NULL, PRIMARY KEY (email))`);
    db.run(`CREATE TABLE IF NOT EXISTS ${dataTableName} (email TEXT UNIQUE NOT NULL, username TEXT NOT NULL, jsondata TEXT NOT NULL, PRIMARY KEY (email))`);
});

//addUser: takes json data of user to add and adds it to the database
const addUser = function(data, callback){
    //if username/email/password dont exist, data is invalid
    if(!data.username || !data.email || !data.password){
        //if so, throw an error
        console.log('invalid user data');
        if(callback) callback(false, "invalid-user-data");
    }
    //check if user exists
    else if(findUserByEmailForVerification(data.email)){
        //if so, throw an error
        console.log('user already found');
        if(callback) callback(false, "user-already-exists");
    }
    //otherwise, insert the user into database
    else {
        //begin an sql transaction,
        db.exec("BEGIN TRANSACTION");
        //where we add the user to the auth table
        db.exec(`INSERT INTO ${authTableName} (email, password, username) VALUES ('${data.email}', '${data.password}', '${data.username}')`);
        //and the data table
        db.exec(`INSERT INTO ${dataTableName} (email, username, jsondata) VALUES ('${data.email}', '${data.username}', '${JSON.stringify({})}')`);
        //commit the transaction
        db.exec("COMMIT TRANSACTION", (err) => {
            //if there is an error,
            if(err){
                //print it out
                console.table(err);
                //check the error value
                switch(err.errno){
                    //errno 19: SQLITE_CONSTRAINT (in this case, meaning a unique value was re-added)
                    case 19:
                        //user already exists
                        if(callback) callback(false, 'user-already-exists');
                        break;
                    //default: default error message
                    default:
                        if(callback) callback(false, "an oopsie happened, im working on it :P");
                }
            }
            else{
                console.log(`user added: ${data.email}`);
                if(callback) callback(true, null);
            }
        });
    }
}

//findUserByEmailForVerification: seaches auth table in database for user, runs the callback function on the row and returns true/false for if found or not
//contains password
//does not contain json data
const findUserByEmailForVerification = function(query, callback){
    let sql = `SELECT * FROM ${authTableName} WHERE email='${query}'`;
    let exists = false;
    db.get(sql, (err, row) => {
        exists = row !== undefined;
        if(err){
            console.log(err);
            if(callback) callback(err, null);
        }
        else if(callback) callback(null, row);
    });
    return exists;
}

//findUserByEamilForClient: searches data table in database for user, runs the callback function on the row and returns true/false for if found or not
//does not contain password
//contains json data
const findUserByEmailForClient = function(query, callback){
    console.log("user search (client) - query=" + query);
    sql = `SELECT * FROM ${dataTableName} WHERE email='${query}'`;
    let exists = false;
    db.get(sql, (err, row) => {
        exists = row !== undefined;
        if(err){
            console.log(err);
            if(callback) callback(err, null);
        }
        else if(callback) callback(null, row);
    });
    return exists;
}

module.exports = {
    db,
    addUser,
    findUserByEmailForVerification,
    findUserByEmailForClient
}