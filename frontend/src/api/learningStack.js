import { API_ENDPOINT } from "./index";

export const getDueLearningStack = async () => {
    const response = await fetch(`${API_ENDPOINT}/learning-stack/due`, {
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const flashcards = await response.json();

    return flashcards;
};

export const getLearningStack = async () => {
    const response = await fetch(`${API_ENDPOINT}/learning-stack`, {
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const flashcards = await response.json();

    return flashcards;
};

export const updateCard = async (stackId) => {
    const response = await fetch(`${API_ENDPOINT}/learning-stack/update/${stackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
      });
    
    return response.status;
};

export const downgradeCard = async (stackId) => {
    const response = await fetch(`${API_ENDPOINT}/learning-stack/downgrade/${stackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
      });
    
    return response.status;
};


export const addLearnStack = async (cardId) => {
    const response = await fetch(`${API_ENDPOINT}/learning-stack/add`, {
        method: "POST",
        body: JSON.stringify({
            cardId: cardId
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });

    const newFlashcard = await response.json();

    return newFlashcard;
};

export const deleteFlashcardFromStack = async (cardId) => {
    const response = await fetch(`${API_ENDPOINT}/learning-stack/delete/${cardId}`, {
        method: "DELETE",
        credentials: "include" // Fügen Sie credentials: "include" hinzu, um Cookies zu senden
    });
    console.log(response);
    return response.status;
};
