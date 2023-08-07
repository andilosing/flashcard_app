const db = require("../db");

const getAllFlashcards = (userId) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT Flashcards.*, CASE WHEN LearningStack.stackId IS NULL THEN 0 ELSE 1 END as inLearningStack
        FROM Flashcards 
        LEFT JOIN LearningStack ON Flashcards.cardId = LearningStack.cardId 
        WHERE Flashcards.userId = ?
        `, [userId], (err, rows) => {
            if(err){
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

const addFlashcard = (userId, front, back) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Flashcards( userId, front, back) VALUES( ?, ?, ?)`, [userId, front, back], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ cardId: this.lastID, userId, front, back, inLearningStack: 0});
      }
    });
  });
};

const removeFlashcard = (cardId, userId) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM Flashcards WHERE cardId = ? AND userID = ?`, [cardId, userId], function (err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes === 1) {
            // Wenn 1 Zeile gelöscht wurde, geben wir die cardId zurück
            resolve(cardId);
          } else {
            // Wenn keine Zeile gelöscht wurde, geben wir eine Fehlermeldung zurück
            resolve({error: "error", message: "Es gab keinen Datensatz, der gelöscht wurden konnte!"});
          }
        }
      });
    });
  };
  

module.exports = {
  addFlashcard,
  getAllFlashcards,
  removeFlashcard
};
