import { addPokedexEntryToQuestionState, AppScreen, AppStateType, defaultQuestionState, getAppStateGlobal, QuestionData, setAppStateGlobal } from "../../App";
import { deepCloneObject } from "../../commonFunctions";
import { filterPokemon } from "../../pokemonData";
import PokemonAnswerChoiceButton from "./answerChoices/AnswerChoiceButton";
import PokemonSearchInputBox from "./answerChoices/AnswerSearchBox";
import { QuestionEventDisplay } from "./questionDisplay/QuestionEventDisplay";
import QuestionGiveUpButton from "./questionDisplay/QuestionGiveUpButton";
import RevealNewPokedexEntryButton from "./questionDisplay/RevealNewPokedexEntryButton";
import QuestionNextButton from "./QuestionNextButton";

export function startNextQuestion(inputQuestion: QuestionData): void {

	var currentState: AppStateType = getAppStateGlobal();
	var newState: AppStateType = deepCloneObject(currentState);

	newState.currentScreen = AppScreen.Question;
	newState.currentQuestion = inputQuestion;
	newState.questionState = defaultQuestionState;

	setAppStateGlobal(newState);

	addPokedexEntryToQuestionState();

}

export function setSelectedAnswerChoice(answerChoiceID: string): void {

	let appState: AppStateType = getAppStateGlobal();

	if (!appState.currentQuestion?.possibleAnswers.includes(answerChoiceID)) {

		console.warn(answerChoiceID + " can't be set as an answer if its not a possible answer choice!")
		return;

	}

	let newState: AppStateType = deepCloneObject(appState)

	if (!newState.questionState) {

		console.error("There's no question state currently!");
		return;

	}

	newState.questionState.selectedAnswerChoice = answerChoiceID;

	setAppStateGlobal(newState);

}

export function submitSelectedAnswer() {

	let newState: AppStateType = deepCloneObject(getAppStateGlobal());
	let wasCorrect = false;

	if (!newState.questionState || !newState.currentQuestion) {
		console.error("Can't submit an answer if we don't even have a full question!");
		return;
	}

	if (!newState.questionState.selectedAnswerChoice) {

		console.warn("We need something selected to submit an answer!");
		return;

	}

	newState.questionState.submittedAnswers.push(newState.questionState.selectedAnswerChoice) //Add the submitted answer to a list of all submitted answers.

	if (newState.questionState.selectedAnswerChoice === newState.currentQuestion.correctAnswer) {

		newState.questionState.questionComplete = true;
		wasCorrect = true;

	}

	//Add question event to the questionEvents array.
	newState.questionState.questionEvents.push({
		submittedAnswerEventData: {
			submittedAnswer: newState.questionState.selectedAnswerChoice,
			wasCorrect: wasCorrect
		},
		pokedexEventData: undefined,
		giveUpEvent: undefined
	});

	newState.questionState.selectedAnswerChoice = null;

	setAppStateGlobal(newState);

}

function QuestionScreen(): JSX.Element {

	const appState = getAppStateGlobal();

	if (appState.currentQuestion === null) {
		return <>Question Data is currently empty...</>
	}
	if (appState.questionState === null) {
		return <>Question State is currently empty...</>
	}

	return (
		<div className="App">
			<QuestionDisplaySection/>
			<BottomSection/>
		</div>
	);

}

function QuestionDisplaySection(): JSX.Element {

	let appState = getAppStateGlobal();

	if (appState.currentQuestion === null) {
		return <>Question Data is currently empty...</>
	}
	if (appState.questionState === null) {
		return <>Question State is currently empty...</>
	}

	let questionEvents: JSX.Element[] = [];

	for (let questionEventsLoop: number = 0; questionEventsLoop < appState.questionState.questionEvents.length; questionEventsLoop++) {

		let eventElementKey: string = "questionEvent" + questionEventsLoop;

		questionEvents.push(<QuestionEventDisplay key={eventElementKey} questionEvent={appState.questionState.questionEvents[questionEventsLoop]} />)

	}

	return (<div className="questionDisplay">
	<div className="questionTitleDiv">{ appState.currentQuestion.questionText } </div>
		{questionEvents}
		<RevealNewPokedexEntryButton /> <br/>
		<QuestionGiveUpButton />
	</div>);
}

function BottomSection(): JSX.Element {

	return (<div className="questionScreenBottomSection">
		<PokemonSearchInputBox/>
		<AnswerChoiceSection />
		<div className="questionNextButtonDiv">
			<QuestionNextButton />
		</div>
	</div>);

}

function AnswerChoiceSection(): JSX.Element {

	let appState = getAppStateGlobal();

	if (appState.currentQuestion === null) {
		return <>Question Data is currently empty...</>
	}
	if (appState.questionState === null) {
		return <>Question State is currently empty...</>
	}
	if (!appState.allPokemonData) {
		return <>Pokemon Data is currently empty...</>
	}

	var filteredPokemonList: string[] = filterPokemon(appState.questionState.currentSearchQuery, appState.allPokemonData, appState.currentQuestion.possibleAnswers);
	console.log(filteredPokemonList);

	var allPokemonElements: JSX.Element[] = [];
	for (let pokemonElementLoop: number = 0; pokemonElementLoop < filteredPokemonList.length; pokemonElementLoop++) {

		if (!filteredPokemonList[pokemonElementLoop]) {
			continue;
		}

		allPokemonElements.push(<PokemonAnswerChoiceButton pokemonID={filteredPokemonList[pokemonElementLoop]} key={filteredPokemonList[pokemonElementLoop]} />);

	}

	return (<div className="answerChoices">
		<span className="answerTilesSpan">
			{allPokemonElements}
		</span>
	</div>);

}

export default QuestionScreen;