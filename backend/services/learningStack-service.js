const db = require("../db");


const getAllLearningStack = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(`
        SELECT LearningStack.stackId, Flashcards.front, Flashcards.back, LearningStack.category
        FROM LearningStack
        INNER JOIN Flashcards ON LearningStack.cardId = Flashcards.cardId
        WHERE LearningStack.userId = ?`, 
        [userId], 
        (err, rows) => {
            if(err){
                reject(err)
            } else {
                if (rows && rows.length > 0) {
                    resolve(rows);
                 
                } else {
                    resolve({}); 
                  
                }
            }
        })
})
}

const getAllDueCardsInLearningStack = (userId) => {
  return new Promise((resolve, reject) => {
      db.all(`
          SELECT LearningStack.stackId, Flashcards.front, Flashcards.back, LearningStack.category
          FROM LearningStack
          INNER JOIN Flashcards ON LearningStack.cardId = Flashcards.cardId
          WHERE LearningStack.nextReviewDate < datetime('now') AND LearningStack.userId = ?`, 
          [userId], 
          (err, rows) => {
              if(err){
                  reject(err)
              } else {
                  if (rows && rows.length > 0) {
                      resolve(rows);
                  } else {
                      resolve({}); 
                    
                  }
              }
          })
  })
}


const addCardToStack = (userId, cardId) => {
  return new Promise((resolve, reject) => {
      // Überprüfen Sie zuerst, ob die Karte in der `Flashcards`-Tabelle existiert
      db.get(`SELECT * FROM Flashcards WHERE cardId = ? AND userId = ?`, [cardId, userId], (err, row) => {
          if (err) {
              reject(err);
          } else if (!row) {
              // Wenn die Karte nicht existiert, geben Sie einen Fehler zurück
              resolve({ message: "Card does not exists." });
          } else {
              // Wenn die Karte existiert, fahren Sie fort und fügen Sie sie zum `LearningStack` hinzu
              db.get(`SELECT * FROM LearningStack WHERE userId = ? AND cardId = ?`, [userId, cardId], (err, row) => {
                  if (err) {
                      reject(err);
                  } else if (row) {
                      resolve({ message: "Card is already in the learning stack." });
                  } else {
                      db.run(`INSERT INTO LearningStack(userId, cardId, nextReviewDate) VALUES(?, ?, datetime('now'))`, [userId, cardId], function (err) {
                          if (err) {
                              reject(err);
                          } else {
                              resolve({ id: this.lastID, userId, cardId });
                          }
                      });
                  }
              });
          }
      });
  });
};


  const removeFlashcardFromStack = (stackId, userId) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM LearningStack WHERE stackId = ? AND userID = ?`, [stackId, userId], function(err, row){
            if (err) {
                reject(err);
              } else {
                if (this.changes === 1) {
                  // Wenn 1 Zeile gelöscht wurde, geben wir die cardId zurück
                  resolve(stackId);
                } else {
                  // Wenn keine Zeile gelöscht wurde, geben wir eine Fehlermeldung zurück
                  resolve({error: "error", message: "Es gab keinen Datensatz, der gelöscht wurden konnte!"});
                }
              }
        })
    })
}

 
  const updateCardCategory = (stackId, userId) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT category FROM LearningStack WHERE stackId = ? and userId = ?`, [stackId, userId], function(err, row) {
        if (err) {
          reject(err);
        } else if (row) {
          let newCategory = row.category + 1;
          if (newCategory > 5) {
            newCategory = 5;
          }

          console.log("test")
  
          let daysToAddTilNewReview; 
          switch(newCategory){
            case 1:
              daysToAddTilNewReview = 1;
              break;
            case 2:
              daysToAddTilNewReview = 3;
              break;
            case 3:
              daysToAddTilNewReview = 7;
              break;
            case 4:
              daysToAddTilNewReview = 14;
              break;
            case 5:
              daysToAddTilNewReview = 30;
              break;
            default:
              daysToAddTilNewReview = 1;
          }
  
          db.run(`UPDATE LearningStack SET category = ?, nextReviewDate = datetime('now', '+${daysToAddTilNewReview} days') WHERE stackId = ? and userId = ?`, [newCategory, stackId, userId], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: stackId, newCategory: newCategory, nextReviewInDays: daysToAddTilNewReview });
            }
          });
        } else {
          reject(new Error(`No LearningStack found with id ${stackId}`));
        }
      });
    });
  };


  const downgradeCardCategory = (stackId, userId) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT category FROM LearningStack WHERE stackId = ?`, [stackId], function(err, row) {
        if (err) {
          reject(err);
        } else if (row) {
          let newCategory = row.category - 1;
          console.log("new Category: " + newCategory)
          if (newCategory < 1) {
            newCategory = 1;
          }
          console.log(row.category)
  
          let daysToAddTilNewReview; 
          switch(newCategory){
            case 1:
              daysToAddTilNewReview = 1;
              break;
            case 2:
              daysToAddTilNewReview = 3;
              break;
            case 3:
              daysToAddTilNewReview = 7;
              break;
            case 4:
              daysToAddTilNewReview = 14;
              break;
            case 5:
              daysToAddTilNewReview = 30;
              break;
            default:
              daysToAddTilNewReview = 1;
          }

          
  
          db.run(`UPDATE LearningStack SET category = ?, nextReviewDate = datetime('now', '+${daysToAddTilNewReview} days') WHERE stackId = ?`, [newCategory, stackId], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: stackId, newCategory: newCategory, nextReviewInDays: daysToAddTilNewReview });
            }
          });
        } else {
          reject(new Error(`No LearningStack found with id ${stackId}`));
        }
      });
    });
  };
  

  module.exports = {
    addCardToStack,
    updateCardCategory,
    getAllLearningStack,
    downgradeCardCategory,
    getAllDueCardsInLearningStack,
    removeFlashcardFromStack
  };