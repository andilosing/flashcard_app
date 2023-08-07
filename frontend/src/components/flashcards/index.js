import React, { useState, useEffect, useContext } from "react";
import {
    getFlashcards,
    deleteFlashcard,
    addFlashcard
} from "../../api/flashcards"
import {
    addLearnStack
} from "../../api/learningStack"
import {FlashcardsContext} from "../../provider/flashcards";
import Flashcard from "./Flashcard";
import { useNavigate } from "react-router-dom";


const Flashcards = () => {
    const {
        state: {flashcards},
        dispatch
    } = useContext(FlashcardsContext)

    const [newFrontText, setNewFrontText] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()
  
    

    async function fetchData() {
        
            try {
                const flashcardData = await getFlashcards();
                dispatch({type: "LOADED_FLASHCARDS", payload: flashcardData});
            } catch (error) {
                if (error.message.includes('404')) {
                   navigate("/login");  // Navigiert zur Login-Seite
                } else {
                    console.error(error);
                }
            
        }
    }

    useEffect(() => {
       

        fetchData()
    }, [dispatch])

    const onDeleteFlashcard = async (cardId) => {
        const responseStatus = await deleteFlashcard(cardId)
        if(responseStatus !== 200){
            alert("Deleting failed")
            return
        } 
        
        dispatch({type: "DELETE_FLASHCARD", payload: cardId})
    }

    const onAddNewFlashCard = async (e) => {
        e.preventDefault()

        const newFlashcard = await addFlashcard(newFrontText)
        setNewFrontText("")
        dispatch({type: "ADD_FLASHCARD", payload: newFlashcard})
    }

    const onAddLearnStack = async (cardId) => {
        const learnstackCardData= await addLearnStack (cardId)
        
        dispatch({type: "ADD_LEARNSTACK", payload: cardId})
        

    }

    const onIsEditing = async () => {
        setIsEditing(!isEditing)
        console.log("Editing:" + isEditing)
    }

    return (
        <div>
            <div id="flashcards" />
            <h2>Flashcards</h2>
            <button className="edit-btn" onClick={onIsEditing}>{isEditing ? "close edit" : "edit"}</button>
            <table className="flashcard-table">
                <thead>
                    <tr>
                        <th className="header"><span className="flag">🇩🇪</span> Deutsch</th>
                        <th className="header"><span className="flag">🇷🇺</span> Russisch</th>
                       {isEditing && <th className="header"><span className="flag">Edit</span></th>}
                    </tr>
                </thead>
                <tbody>
                    {flashcards.map((flashcard) => (
                        <Flashcard
                            key={flashcard.cardId}
                            flashcard={flashcard}
                            onDeleteFlashcard={() => onDeleteFlashcard(flashcard.cardId)}
                            onAddLearnStack={() => onAddLearnStack(flashcard.cardId)}
                            isEditing={isEditing}
                        />
                    ))}
                </tbody>
            </table>
            <div className="add-new-flashcard">
                <h3>Add new Flashcard</h3>
                <form onSubmit={(e) => onAddNewFlashCard(e, newFrontText)}>
                    <label htmlFor="frontText">Front Text: </label>
                    <input
                        type="text"
                        id="front-text"
                        value={newFrontText}
                        onChange={(e) => setNewFrontText(e.target.value)}
                    />
                    <button type="submit" className="save-button">Save</button>
                </form>
            </div>
        </div>
    )


}

export default Flashcards