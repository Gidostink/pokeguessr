import React, { useState } from 'react';
import { getCurrentURL } from '.';
import './css/App.css';
import { deepCloneObject, shuffleArray } from './commonFunctions';
import { PokemonData, PokemonDataLoadedState } from './pokemonData';
import QuestionScreen, { startNextQuestion } from './elements/questionScreen/QuestionScreen';

export enum AppScreen {

	LoadingPokemonData = "Loading Pokemon Data",
	GeneratingQuestion = "Generating Question",
	ModeMenu = "Mode Menu",
	Question = "Question"

}

export type AppStateType = {


	currentScreen: AppScreen,
	allPokemonData: { [key: string]: PokemonData } | null,
	allPokemonList: string[] | never[],
	pokemonDataLoadedState: PokemonDataLoadedState,
	currentQuestion: QuestionData | null,
	questionState: QuestionState | null

}

export type QuestionData = {

	possibleAnswers: string[],
	correctAnswer: string,
	questionText: string,
	pokedexEntries: string[]

}

export type QuestionState = {

	selectedAnswerChoice: string | null,
	questionComplete: boolean,
	currentSearchQuery: string,
	pokedexEntryCount: number,
	questionEvents: QuestionEvent[],
	submittedAnswers: string[]

}

export type QuestionEvent = {

	pokedexEventData: PokedexEventData | undefined
	submittedAnswerEventData: SubmitAnswerEventData | undefined

}

export type PokedexEventData = {

	pokedexEntryText: string

}

export type SubmitAnswerEventData = {

	submittedAnswer: string,
	wasCorrect: boolean

}

const defaultLoadedState: PokemonDataLoadedState = { "dataInitalized": false, "loadStarted": false, "totalPokemonCount": -1, "pokemonLoadedCount": 0 }
export const defaultQuestionState: QuestionState = { "questionComplete": false, "currentSearchQuery": "", "pokedexEntryCount": 0, "selectedAnswerChoice": null, questionEvents: [], submittedAnswers: [] }

var initalAppState: AppStateType = { currentScreen: AppScreen.LoadingPokemonData, allPokemonData: null, allPokemonList: [], pokemonDataLoadedState: defaultLoadedState, currentQuestion: null, questionState: null }

export function appStateSetScreen(targetScreen: AppScreen) {

	var currentState: AppStateType = getAppStateGlobal();
	var newState: AppStateType = deepCloneObject(currentState);

	newState.currentScreen = targetScreen;

	setAppStateGlobal(newState);

}

export function addPokedexEntryToQuestionState() {

	let currentState: AppStateType = getAppStateGlobal();
	let newState:AppStateType = deepCloneObject(currentState);

	if (newState.questionState === null) {
		console.warn("This method shouldn't be called before a Question State is initalized.");
		return;
	}
	if (newState.currentQuestion === null) {
		console.warn("This method shouldn't be called before Question Data is initalized.");
		return;
	}

	newState.questionState.questionEvents.push({ pokedexEventData: { pokedexEntryText: newState.currentQuestion.pokedexEntries[newState.questionState.pokedexEntryCount] }, submittedAnswerEventData: undefined})
	newState.questionState.pokedexEntryCount++;

	setAppStateGlobal(newState);

}

export function getAppStateGlobal(): AppStateType {

	//If getAppStateInternal isn't defined yet, just return the initalAppState.
	if (!getAppStateInternal) {
		return initalAppState;
	}

	var returnValue = getAppStateInternal();

	//If the returnValue is undefined, just return the initalAppState.
	if (returnValue === undefined) {
		return initalAppState;
	}

	return returnValue;

};

export function setAppStateGlobal(input: AppStateType) {

	//If setAppStateInternal exists, run it.
	if (setAppStateInternal) {
		setAppStateInternal(input);
	} else { //Otherwise, if setAppStateInternal doesn't exist, set this to initalAppState. I'm sure it won't go wrong.
		initalAppState = input;
	}

}

var getAppStateInternal: Function | undefined;
var setAppStateInternal: Function | undefined;

function App(): JSX.Element {

	const [appState, setAppState] = useState(initalAppState);

	setAppStateInternal = ((input: AppStateType): void => {

		setAppState(input)
		getAppStateInternal = (() => { return input }) //Fakes correct return until the component runs again.

	});
	getAppStateInternal = ((): AppStateType => { return appState });

	if (appState.currentScreen === AppScreen.Question) {
		return QuestionScreen();
	}

	if (appState.currentScreen === AppScreen.LoadingPokemonData) {
		return loadingScreen();
	}

	return <>I think there's supposed to be a "{appState.currentScreen}" screen here.</>

}


function loadingScreen(): JSX.Element {

	const loadingState = getAppStateGlobal().pokemonDataLoadedState;

	if (!loadingState.loadStarted) {
		return (<div className="App">
			Fetching the list of Pokémon...
		</div>)
	}

	return (<div className="App">
		{loadingState.pokemonLoadedCount}/{loadingState.totalPokemonCount}
	</div>);

}

export async function TEMP_generateNewQuestion() {

	appStateSetScreen(AppScreen.GeneratingQuestion);

	await TEMP_generateTestQuestion()
		.then((questionData) => {
			console.log(questionData.correctAnswer);

			startNextQuestion(questionData);
		})

}
export async function TEMP_generateTestQuestion(): Promise<QuestionData> {

	return new Promise<QuestionData>((resolve) => {

		const pokemonList: string[] = getAppStateGlobal().allPokemonList;
		const correctPokemonID: string = pokemonList[Math.floor(Math.random() * pokemonList.length)];

		fetch(getCurrentURL() + "/data/pokemon/" + correctPokemonID + "/pokedex.json")
			.then(fetchedData => fetchedData.json())
			.then((pokedexData: string[]) => {


				let pokedexEntries: string[] = shuffleArray(pokedexData);

				var newQuestion: QuestionData = { correctAnswer: correctPokemonID, pokedexEntries: pokedexEntries, possibleAnswers: pokemonList, questionText: "What species of Pok\u00e9mon is this Pok\u00e9dex entry describing?" }

				resolve(newQuestion);

			})

	});

}

export default App;
