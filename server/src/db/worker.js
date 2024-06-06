const sqlite3 = require("sqlite3").verbose();
const sqlstring = require("sqlstring");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config("../../");

const dev = process.env.DEVELOPER === "true";

const db = new sqlite3.Database('nos-db.sqlite');
const authTableName = "auth";
const dataTableName = "data";

const authTable = authTableName + "(uuid TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, PRIMARY KEY (uuid))";
const dataTable = dataTableName + "(uuid TEXT UNIQUE NOT NULL, username TEXT NOT NULL, jsondata TEXT NOT NULL, PRIMARY KEY (uuid))";

const userTransactionHistoryTableCols = "(type TEXT NOT NULL, centamount INT, info TEXT)";

//initialize the database:
db.serialize(() => {
    console.log("creating db table");
    db.run(`CREATE TABLE IF NOT EXISTS ${authTable}`);
    db.run(`CREATE TABLE IF NOT EXISTS ${dataTable}`);
});

/**
 * addUser(): adds a user to the database
 *
 * @param { {username: string, email: string, password: string} } data user data
 * @returns { Promise } a promise with no data on resolve, and an error message on reject
 */
const addUser = function(data){
    return new Promise((resolve, reject) => {
        //if username/email/password dont exist, data is invalid
        if(!data.username || !data.email || !data.password){
            //if so, throw an error
            console.log('invalid user data');
            reject("invalid-user-data");
        }
        //check if user exists
        findUserByEmailForVerification(data.email)
        .then((row) => {
            //if row !== undefined, the user exists already
            if (row !== undefined){
                //if so, throw an error
                console.log('user already found');
                reject("user-already-exists");
                return;
            }
            //otherwise, add the user:

            //create a new uuid
            let uuid = uuidCreate();
            //begin an sql transaction,
            db.exec("BEGIN TRANSACTION");
            //where we add the user to the auth table
            db.run(`INSERT INTO ${authTableName} (uuid, email, password) VALUES (?, ?, ?)`, uuid, data.email, data.password);
            //and the data table
            db.run(`INSERT INTO ${dataTableName} (uuid, username, jsondata) VALUES (?, ?, '')`, uuid, data.username); //jsondata value intentionally left empty, filled by client
            //commit the transaction
            db.exec("COMMIT TRANSACTION", (err) => {
                //if there is an error, print it out and cancel
                if(err){
                    console.log("addUser SQL transaction error:");
                    console.table(err);
                    reject(dev ? err : "database-error");
                    return;
                }
                //otherwise, log success
                console.log(`user added: ${data.email}`);
                //and create a new table for the user's transaction history
                db.run(`CREATE TABLE IF NOT EXISTS trnx_hist_${uuid} ${userTransactionHistoryTableCols}`, (err) => {
                    if(err){
                        console.log("error in creating user transaction table: " + err);
                        console.table(err);
                        reject(dev ? err : "database-error");
                    }
                    
                    //TODO: CLEAR ROWS IN AUTH AND DATA TABLES IF NEW TABLE CREATION FAILED, JUST IN CASE

                });
                resolve();
            });
        })
        .catch((err) => {
            console.log(err);
            reject(dev ? err : "database-error");
        })
    });
}

/**
 * findUserByEmailForVerification(): searches auth table for user, runs callback function on the user's row
 *
 * @param { string } query the email to search for
 * @returns { Promise } a promise with the row object on resolve, or error on reject
 */
const findUserByEmailForVerification = function(query){

    let sql = `SELECT * FROM ${authTableName} WHERE email=?`;

    return new Promise((resolve, reject) => {
        db.get(sql, query, (err, row) => {
            if(err) reject(err);
            else resolve(row);
        });
    });
}


/**
 * findUserByEmailForClient(): searches data table for user, runs callback function on the user's row
 *
 * @param { string } query the email to serach for
 * @returns { Promise } a promise with the row object on resolve, or error on reject
 */
const findUserByEmailForClient = function(query){

    //search auth table for uuid
    let sql = `SELECT * FROM ${dataTableName} WHERE uuid=?`;
    let uuid;

    return new Promise((resolve, reject) => {
        findUserByEmailForVerification(query)
        .then((authRow) => {
            uuid = authRow.uuid;
            db.get(sql, uuid, (err, dataRow) => {
                if(err) reject(err);
                else resolve(dataRow);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

/**
 * uuidCreate(): generates a uuid (and double checks that it didnt mega-lucky RNG roll an already existing one lol)
 * @returns { string } uuid generated
 */
const uuidCreate = function() {
    let uuid;
    do{
        uuid = uuidv4().replaceAll('-','');
    }while(uuidExists());
    console.log("uuid generated: " + uuid);
    return uuid;
}

/**
 * uuidExists(): double checks the auth table for existing uuid
 * @param { string } uuid the uuid to check
 * @returns { boolean } whether or not the uuid exists already
 */
const uuidExists = function(uuid){
    let exists = false;
    db.get(`SELECT * FROM ${authTableName} WHERE uuid=?`, uuid, (err, row) => {
        exists = row !== undefined;
    });
    return exists;
}

module.exports = {
    db,
    addUser,
    findUserByEmailForVerification,
    findUserByEmailForClient
}