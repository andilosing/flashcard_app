const express = require("express")
const db = require("../db")
const router = express.Router()
const deeplService = require("../services/deepl-service")
const flashcardService = require("../services/flashcard-service")


//get all flashcards
router.get("/", async (req, res, next) => {
    try {
    const userId = req.session.userId
   
     const flashcards = await flashcardService.getAllFlashcards(userId)
     res.json(flashcards)
 
    } catch (error) {
 
     next(error)
     
    }
 
 })

 //add new flashcard
router.post("/add", async (req, res, next) => {
try {

    const {frontText} = req.body
    const userId =  req.session.userId
    const targetLang = "RU"

    if(!userId || !frontText){
        return res.status(407).json({message: 'User ID and front text are required'})
    }

    const translatedText = await deeplService.translateText(frontText, targetLang);
    const newFlashcard = await flashcardService.addFlashcard(userId, frontText, translatedText);

    res.json(newFlashcard)

} catch (error) {
    next(error)
}

})

//delete flashcard
router.delete("/delete/:cardId/", async (req, res, next) => {
    try {

        const {cardId} = req.params
        const userId = req.session.userId

        

    if(!cardId /*|| !userId*/){
        return res.status(400).send("Bad Request")
    }

    const deletedFlashcard = await flashcardService.removeFlashcard(cardId, userId)

    res.status(200).send("Flashcard Deleted")
    } catch (error) {
        next(error)
    }
})









module.exports = router

