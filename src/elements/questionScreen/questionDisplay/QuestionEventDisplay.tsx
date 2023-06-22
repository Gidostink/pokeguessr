import { AppStateType, getAppStateGlobal, PokedexEventData, QuestionEvent, SubmitAnswerEventData } from "../../../App";

export function QuestionEventDisplay({ questionEvent }: {questionEvent: QuestionEvent}): JSX.Element {

    //Check if this event is a Pokedex Event
    if (questionEvent.pokedexEventData) {

        return <PokedexEventDisplay pokedexEvent={questionEvent.pokedexEventData} />

    }

    //Check if this event is a submittedAnswer
    if (questionEvent.submittedAnswerEventData) {

        return <SubmittedAnswerEventDisplay answerEvent={questionEvent.submittedAnswerEventData} />

    }

    if (questionEvent.giveUpEvent) {

        return <GiveUpEvent/>

    }


    return <p>Invalid Question Event!!</p>

}

export function PokedexEventDisplay({ pokedexEvent }: { pokedexEvent: PokedexEventData }): JSX.Element {

    return (<div className="questionEventDiv questionPokedexEntry" >{pokedexEvent.pokedexEntryText}</div>);

}

export function GiveUpEvent(): JSX.Element {

    let appState: AppStateType = getAppStateGlobal();

    if (!appState.questionState) {
        return <>No Question State???</>;
    }

    if (!appState.currentQuestion) {
        return <>No Current Question???</>;
    }

    if (!appState.allPokemonData) {

        return <>No Pokemon Data???</>

    }

    let correctAnswerID = appState.currentQuestion.correctAnswer;
    let pokemonName = appState.allPokemonData[correctAnswerID].name;


    return (<div className="questionEventDiv giveUpEvent">{"The correct answer was " + pokemonName + "..."}</div>);

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

        return (<div className="questionEventDiv correctAnswerSubmission" >{"Your guess, " + answerName + ", was correct!"}</div>)

    } else {

        return (<div className="questionEventDiv incorrectAnswerSubmission">{"Your guess, " + answerName + ", was incorrect..."}</div>)  

    }

}