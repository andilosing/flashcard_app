const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("karteikarten.db", (err) => {
    if(err){
        console.error(err.message)
    } 
    console.log("Connectet to the Karteikarten database.")
})


db.run('PRAGMA foreign_keys = ON;', function(err) {
    if (err) {
      console.error("Foreign key pragma statement didn't work:", err);
    } else {
      console.log("Foreign key check turned on");
    }
  });

//create db table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS Users (
    userId INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`)

db.run(`
CREATE TABLE IF NOT EXISTS Flashcards (
    cardId INTEGER PRIMARY KEY,
    userId INTEGER,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
)`)

db.run(`CREATE TABLE IF NOT EXISTS LearningStack(
    stackId INTEGER PRIMARY KEY,
    userId INTEGER,
    cardId INTEGER,
    category INTEGER DEFAULT 1,
    nextReviewDate TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE,
    FOREIGN KEY (cardId) REFERENCES Flashcards (cardId) ON DELETE CASCADE
  )`);

  
module.exports = db



