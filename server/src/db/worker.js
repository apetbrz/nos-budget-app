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

/**
 * addUser(): adds a user to the database
 *
 * @param { {username: string, email: string, password: string} } data user data
 * @param { (success: boolean, err: string) } callback runs after user insert
 * @returns { success: boolean } true if user inserted successfully, false if failed to insert user
 */
const addUser = function(data, callback){
    //if username/email/password dont exist, data is invalid
    if(!data.username || !data.email || !data.password){
        //if so, throw an error
        console.log('invalid user data');
        if(callback) callback(false, "invalid-user-data");
        return false;
    }
    //check if user exists
    else if(findUserByEmailForVerification(data.email)){
        //if so, throw an error
        console.log('user already found');
        if(callback) callback(false, "user-already-exists");
        return false;
    }
    //otherwise, insert the user into database
    else {
        let success = false;
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
                success = true;
            }
        });
        return success;
    }
}

/**
 * findUserByEmailForVerification(): searches auth table for user
 *
 * @param { string } query the email to search for
 * @param {(err: Error | null, row: Object | null)} callback if row found, err = null and row = row object, or if not found, err = error and row = null
 * @returns { boolean } true if user found, false if not
 */
const findUserByEmailForVerification = function(query, callback){
    let sql = `SELECT * FROM ${authTableName} WHERE email='${query}'`;
    let exists = false;
    db.get(sql, (err, row) => {
        //if row === undefined, user does not exist
        exists = row !== undefined;
        //TODO: SQLITE3 ERROR HANDLING
        if(err){
            console.log(err);
            if(callback) callback(err, null);
        }
        else if(callback) callback(null, row);
    });
    return exists;
}


/**
 * findUserByEmailForClient
 *
 * @param { string } query the email to serach for
 * @param {(err: Error | null, row: Object | null)} callback if row found, err = null and row = row object, or if not found, err = error and row = null
 * @returns { boolean } true if user found, false if not
 */
const findUserByEmailForClient = function(query, callback){
    let sql = `SELECT * FROM ${dataTableName} WHERE email='${query}'`;
    let exists = false;
    db.get(sql, (err, row) => {
        //if row === undefined, user does not exist
        exists = row !== undefined;
        //TODO: SQLITE3 ERROR HANDLING
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