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

    return (<p><div>{pokedexEvent.pokedexEntryText}</div></p>);

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

        return (<p>{"Correct! The answer was " + answerName + "."}</p>)

    } else {

        return (<p>{"Incorrect! The answer was not " + answerName + "."}</p>)  

    }

}