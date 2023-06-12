import { getAppStateGlobal, PokedexEventData, QuestionEvent, SubmitAnswerEventData } from "../../../App";

export function QuestionEventDisplay({ questionEvent }: {questionEvent: QuestionEvent}): JSX.Element {

    //Check if this event is a Pokedex Event
    if (questionEvent.pokedexEventData) {

        return <PokedexEventDisplay pokedexEvent={questionEvent.pokedexEventData} />

    }

    //Check if this event is a submittedAnswer
    if (questionEvent.submittedAnswerEventData) {

        return <SubmittedAnswerEventDisplay answerEvent={questionEvent.submittedAnswerEventData} />

    }


    return <p>Invalid Question Event!!</p>

}

export function PokedexEventDisplay({ pokedexEvent }: { pokedexEvent: PokedexEventData }): JSX.Element {

    return (<div className="questionEventDiv questionPokedexEntry" >{pokedexEvent.pokedexEntryText}</div>);

}

export function SubmittedAnswerEventDisplay({answerEvent}: {answerEvent: SubmitAnswerEventData}): JSX.Element {

    let appState = getAppStateGlobal();

    if (!appState.allPokemonData) {

        return <p>There's no allPokemonData!</p>

    }

    if (!appState.allPokemonData[answerEvent.submittedAnswer]) {

        return <p>This answer has no corresponding Pokemon!</p>

    }

    let answerName = appState.allPokemonData[answerEvent.submittedAnswer].name;

    if (answerEvent.wasCorrect) {

        return (<div className="questionEventDiv correctAnswerSubmission" >{"The answer was " + answerName + "."}</div>)

    } else {

        return (<div className="questionEventDiv incorrectAnswerSubmission">{"The answer was not " + answerName + "."}</div>)  

    }

}