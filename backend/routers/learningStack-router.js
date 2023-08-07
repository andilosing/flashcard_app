const express = require("express")
const db = require("../db")
const router = express.Router()
const learingStackService = require("../services/learningStack-service")


//get learningstack
router.get("/", async (req, res, next) => {
    try {
      const userId = req.session.userId
     const learningStack = await learingStackService.getAllLearningStack(userId)
     res.json(learningStack)
 
    } catch (error) {
 
     next(error)
     
    }
 
 })

 //get due flashcards in learning stack
 router.get("/due", async (req, res, next) => {
    try {
      const userId = req.session.userId
     const dueFlashcards = await learingStackService.getAllDueCardsInLearningStack(userId)
     res.json(dueFlashcards)
 
    } catch (error) {
 
     next(error)
     
    }
 
 })



//add to learning Stack
router.post("/add", async (req, res, next) => {
    try {

        const {cardId} = req.body
        const userId = req.session.userId
        
    
        if(!userId || !cardId){
            return res.status(400).json({message: 'User ID and Card Id are required'})
        }
    
        const addedCard = await learingStackService.addCardToStack(userId, cardId);
       
    
        res.json(addedCard)
    
    } catch (error) {
        next(error)
    }
    
    })

    //delete card from stack
router.delete("/delete/:stackId/", async (req, res, next) => {
    try {
       
        const {stackId} = req.params
        const userId = req.session.userId

    if(!stackId || !userId){
        return res.status(400).json({message: "stackId must be entered!"})
    }

    const deletedFlashcardFromStack = await learingStackService.removeFlashcardFromStack(stackId, userId)

    res.status(200).send("Deleted suceesfull")
    } catch (error) {
        next(error)
    }
})

    //updateCardInStack
    router.put("/update/:stackId", async (req, res, next) => {
        try {
          const { stackId } = req.params;
          const userId = req.session.userId
      
          if (!stackId) {
            return res.status(400).json({ message: "StackId must be provided!" });
          }
      
          const result = await learingStackService.updateCardCategory(stackId, userId);
      
          res.status(200).send("upgraded card category");
        } catch (error) {
          next(error);
        }
      });

      //downgrade Card in Stack
    router.put("/downgrade/:stackId", async (req, res, next) => {
        try {
          
          const { stackId } = req.params;
          const userId = req.session.userId
      
          if (!stackId) {
            return res.status(400).json({ message: "StackId must be provided!" });
          }
      
          const result = await learingStackService.downgradeCardCategory(stackId, userId);
      
          res.status(200).send("upgraded card category");
        } catch (error) {
          next(error);
        }
      });


    module.exports = router
    