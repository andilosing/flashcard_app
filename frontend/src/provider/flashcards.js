import React from "react"

export const FlashcardsInitialState = {
    flashcards: [],
    dueLearningStack: [],
    learningStack: []
}

export const FlashcardsReducer = (state = FlashcardsInitialState, action) => {
    switch(action.type){
        case "LOADED_FLASHCARDS": {
            return {...state, flashcards: action.payload}
        }
        case "DELETE_FLASHCARD": {
            return {
                ...state,
                flashcards: state.flashcards.filter(
                    (flashcard) => flashcard.cardId !== action.payload
                )
            }
        }
        case "ADD_FLASHCARD": {
            return { ...state, flashcards: [...state.flashcards, action.payload]}
        }

        case "ADD_LEARNSTACK": {
            const nextFlashcardState = [...state.flashcards];
            const cardToUpdate = nextFlashcardState.find(
                (card) => card.cardId === action.payload
            );
            if (cardToUpdate) {
                cardToUpdate.inLearningStack = 1; // inLearningStack wird auf 1 gesetzt
            } else {
                console.log("Card not found"); // falls die Karte nicht gefunden wurde
            }
            return { ...state, flashcards: nextFlashcardState };
        }
        

        // ab hier LearningStack
        case "LOADED_LEARNING_STACK": {
            return {...state, learningStack: action.payload}
        }

        case "LOADED_DUE_LEARNING_STACK": {
            return {...state, dueLearningStack: action.payload}
        }
        case "UPGRADE_FLASHCARD": {
            const nextLearningStackState = [...state.learningStack]
            const cardToUpdate = nextLearningStackState.find(
                (card) => card.stackId === action.payload
            )
            if(cardToUpdate.category < 5){
                cardToUpdate.category = cardToUpdate.category + 1 
            }
            return {...state, learningStack: nextLearningStackState}
        }

        case "DOWNGRADE_FLASHCARD": {
            const nextLearningStackState = [...state.learningStack]
            const cardToUpdate = nextLearningStackState.find(
                (card) => card.stackId === action.payload
            )
            if(cardToUpdate.category > 1){
                cardToUpdate.category = cardToUpdate.category - 1  // Änderung hier
            }
            return {...state, learningStack: nextLearningStackState}
        }
        

        
                case "DELETE_CARD_FROM_STACK": {
                    const nextLearningStackState = state.learningStack.filter(
                        (stackCard) => stackCard.stackId !== action.payload
                    );
                    const nextDueLearningStackState = Array.isArray(state.dueLearningStack) ? state.dueLearningStack.filter(
                        (stackCard) => stackCard.stackId !== action.payload
                    ) : [];
                    
                    return {
                        ...state,
                        learningStack: nextLearningStackState,
                        dueLearningStack: nextDueLearningStackState,
                    };
                }

                case "RESET": {
                    return FlashcardsInitialState;
                  }
        
        
        
        




        default: 
        return state;
    }
}

 export const FlashcardsContext = React.createContext({
    state: FlashcardsInitialState,
    dispatch: (action) => {}
})

export const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogin: () => {},
    onLogout: () => {},
  });

