
const db = require("../db");


const getUser = (userName) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Users WHERE username = ?`, [userName], (err, user) => {
        if (err) {
          reject(err);
        } else {
          if (user) {
            resolve(user);
            console.log("User: "  + user)
          } else {
            resolve(null);
          }
        }
      });
    });
  };

  const createUser = (userName, password) => {
    return new Promise((resolve, reject) => {
      // Überprüfe zuerst, ob der Benutzername bereits existiert
      db.get(`SELECT * FROM Users WHERE userName = ?`, [userName], (err, user) => {
        if (err) {
          reject(err);
        } else if (user) {
            resolve({ status: 'error', message: 'Username already exists' });
        } else {
          // Wenn der Benutzername noch nicht existiert, füge den neuen Benutzer ein
          db.run(`INSERT INTO Users (username, password) VALUES (?,?)`, [userName, password], function (err) {
            if (err) {
              reject(err);
            } else {
              // Nutze `this.lastID` um die ID des zuletzt eingefügten Benutzers zu erhalten
              db.get(`SELECT * FROM Users WHERE userId = ?`, [this.lastID], (err, user) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(user);
                }
              });
            }
          });
        }
      });
    });
  };
  
  module.exports = {
    createUser,
    getUser
  };