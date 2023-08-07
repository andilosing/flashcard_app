import React, {useContext, useEffect, useState} from "react"
import LearningStack from "./LearningStack"

import {
    getDueLearningStack,
    getLearningStack,
    updateCard,
    downgradeCard, 
    deleteFlashcardFromStack
} from "../../api/learningStack"
import {FlashcardsContext} from "../../provider/flashcards"
import { useNavigate } from "react-router-dom"

const LearningStacks = () => {
    const {
        state: {dueLearningStack, learningStack}, 
        dispatch,
    } = useContext(FlashcardsContext)

    const [showOnlyDue, setShowOnlyDue] = useState(true)
    const navigate = useNavigate()
    
    

    async function fetchData() {
         try {
        const dueLearningStackData = await getDueLearningStack()
       
       
        dispatch({
            type: "LOADED_DUE_LEARNING_STACK",
            payload: dueLearningStackData, 
        })

    } catch (error) {
        console.log("jier:" + error)
            if (error.message.includes('404')) {
               navigate("/login");  // Navigiert zur Login-Seite
            } else {
                console.error(error);
            }
        
    }

    try {

        const learningStackData = await getLearningStack()
      
        dispatch({
            type: "LOADED_LEARNING_STACK",
            payload: learningStackData, 
        })


    } catch (error) {
        console.log("jier:" + error)
            if (error.message.includes('404')) {
               navigate("/login");  // Navigiert zur Login-Seite
            } else {
                console.error(error);
            }
        
    }

       
    }
    

    useEffect(() => {
        fetchData()
    },  [dispatch]);

const onUpdateCard = async (stackId) => {
    const responseStatus = await updateCard(stackId)
    if(responseStatus !== 200){
        alert("Update failing")
    }

    

    dispatch({
        

        type: "UPGRADE_FLASHCARD",
        payload: stackId
    })

    fetchData()

    
}

const onDowngradeCard = async (stackId) => {
    const responseStatus = await downgradeCard(stackId)
    if(responseStatus !== 200){
        alert("Downgrade failing")
    }

    dispatch({
        

        type: "DOWNGRADE_FLASHCARD",
        payload: stackId
    })

    fetchData()

    
}


const onRemoveCard = async (stackId) => {
    const responseStatus = await deleteFlashcardFromStack(stackId)
    if(responseStatus !== 200){
        alert("Deleting failed")
        return
    } 
    
    dispatch({type: "DELETE_CARD_FROM_STACK", payload: stackId})
}





return (
    <div>
        <button className="switch-learning-stack-btn" onClick={() => setShowOnlyDue(!showOnlyDue)}> 
            {showOnlyDue ? "See Learning Stack" : "See Due Learning Stack"} 
        </button>

        {!showOnlyDue && (
            <>
                <h2> Learning Stack</h2>
                <ul>
                    {learningStack.length > 0 && learningStack.map((flashcard) => (
                        <li key={flashcard.stackId}>
                            <LearningStack
                            
                            isDueLearningStack={false}
                            flashcard={flashcard}
                            onUpdateCard={() => {
                                onUpdateCard(flashcard.stackId)
                            }}
                            onDowngradeCard={() => {
                                onDowngradeCard(flashcard.stackId)
                            }}
                            onRemoveCard={() => {
                                onRemoveCard(flashcard.stackId)
                            }}
                            />
                        </li>
                    ))}
                </ul>
            </>
        )}

        {showOnlyDue && (
            <>
                <h2>Due Learning Stack</h2>
                <ul>
                    {dueLearningStack.length > 0 && dueLearningStack.map((flashcard) => (
                        <li key={flashcard.stackId}>
                            <LearningStack
                            
                            isDueLearningStack={true}
                            flashcard={flashcard}
                            onUpdateCard={() => {
                                onUpdateCard(flashcard.stackId)
                            }}
                            onDowngradeCard={() => {
                                onDowngradeCard(flashcard.stackId, flashcard.category)
                            }}
                           
                            />
                        </li>
                    ))}
                </ul>
            </>
        )}
    </div>
)



}

export default LearningStacks