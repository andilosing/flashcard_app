import React, {useState, useEffect} from "react";

const Flashcard = ({
    flashcard,
    onDeleteFlashcard,
    onAddLearnStack,
    isEditing
}) => {

  
    

    return (
      <>
    <tr className="flashcard-list">
        <td id="german">{flashcard.front}</td>
        <td id="russian">{flashcard.back}</td>
        {isEditing && <td id="edit">
          
        <div className="flashcard-buttons">
                    <button className="delete-button" onClick={onDeleteFlashcard}>delete</button>
                    {flashcard.inLearningStack === 0 ?
                        <button className="add-to-stack-button" onClick={onAddLearnStack}>add to learning stack</button>
                        : 
                        <p className="learning-stack-text"></p>
                    }
                </div>
          </td>}
    </tr>
   
        
</>
  )



    
}

export default Flashcard