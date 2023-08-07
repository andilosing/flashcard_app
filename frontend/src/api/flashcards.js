import { API_ENDPOINT } from "./index";


export const getFlashcards = async () => {
    const response = await fetch(`${API_ENDPOINT}/flashcards`, {
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const flashcards = await response.json();
   
    return flashcards;
};

export const deleteFlashcard = async (cardId) => {
    const response = await fetch(`${API_ENDPOINT}/flashcards/delete/${cardId}`, {
        method: "DELETE",
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });
    
    return response.status;
};

export const addFlashcard = async (frontText) => {
    const response = await fetch(`${API_ENDPOINT}/flashcards/add`, {
        method: "POST",
        body: JSON.stringify({
            frontText: frontText
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });

    const newFlashcard = await response.json();

    return newFlashcard;
};
