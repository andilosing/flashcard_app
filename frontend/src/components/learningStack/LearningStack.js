import React, {useState} from "react"

const LearningStack = ({
    flashcard, 
    onUpdateCard,
    onDowngradeCard,
    onRemoveCard,
    isDueLearningStack,
}) => {
    const [hideBack, setHideBack] = useState(true);

    return (
        <div className="learning-stack">
            <p>🇩🇪:  {flashcard.front}</p>
            {(!isDueLearningStack || !hideBack) && <p>🇷🇺:  {flashcard.back}</p>}
            
           

            <div className="learning-stack-buttons">
                {(isDueLearningStack && !hideBack) && (
                    <button className="upgrade-btn" onClick={onUpdateCard}>
                        Correct
                    </button>
                )}
                {(isDueLearningStack && !hideBack) && (
                    <button className="downgrade-btn" onClick={onDowngradeCard}>
                        False
                    </button>
                )}
                {!isDueLearningStack && (
                    <button className="remove-btn" onClick={onRemoveCard}>
                        Remove
                    </button>
                )}
                {isDueLearningStack && (
                    <button onClick={() => setHideBack(!hideBack)}>
                        {hideBack ? "Show Back" : "Hide Back"}
                    </button>
                )}
            </div>
        </div>
    )
}

export default LearningStack
