import React, { useState } from 'react';
import './App.css';
import { deepCloneObject } from './commonFunctions';
import PokemonAnswerChoiceButton from './elements/questionScreen/AnswerChoiceButton';
import RevealNewPokedexEntryButton from './elements/questionScreen/RevealNewPokedexEntryButton';
import { PokemonData, PokemonDataLoadedState } from './pokemonData';

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

	selectedPokemonID: string | null,
	answerSubmitted: boolean,
	currentSearchQuery: string,
	pokedexEntryCount: number

}



const defaultLoadedState: PokemonDataLoadedState = { "dataInitalized": false, "loadStarted": false, "totalPokemonCount": -1, "pokemonLoadedCount": 0 }
export const defaultQuestionState: QuestionState = { "answerSubmitted": false, "currentSearchQuery": "", "pokedexEntryCount": 1, "selectedPokemonID": null }

var initalAppState: AppStateType = { currentScreen: AppScreen.LoadingPokemonData, allPokemonData: null, allPokemonList: [], pokemonDataLoadedState: defaultLoadedState, currentQuestion: null, questionState: null }

export function appStateSetScreen(targetScreen: AppScreen) {

	var currentState: AppStateType = getAppStateGlobal();
	var newState: AppStateType = deepCloneObject(currentState);

	newState.currentScreen = targetScreen;

	setAppStateGlobal(newState);

}

export function startNextQuestion(inputQuestion: QuestionData): void {

	var currentState: AppStateType = getAppStateGlobal();
	var newState: AppStateType = deepCloneObject(currentState);

	newState.currentScreen = AppScreen.Question;
	newState.currentQuestion = inputQuestion;
	newState.questionState = defaultQuestionState;

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
		return questionScreen();
	}

	if (appState.currentScreen === AppScreen.LoadingPokemonData) {
		return loadingScreen();
	}

	return <>I think there's supposed to be a "{appState.currentScreen}" screen here.</>

}



function questionScreen(): JSX.Element {

	const appState = getAppStateGlobal();

	if (appState.currentQuestion === null) {
		return <>Question Data is currently empty...</>
	}
	if (appState.questionState === null) {
		return <>Question State is currently empty...</>
	}

	

	var allPokemonList = appState.allPokemonList;

	var allPokemonElements: JSX.Element[] = [];

	for (let pokemonElementLoop: number = 0; pokemonElementLoop < allPokemonList.length; ++pokemonElementLoop) {

		allPokemonElements.push(<PokemonAnswerChoiceButton pokemonID={allPokemonList[pokemonElementLoop]} key={allPokemonList[pokemonElementLoop]} />);

	}

	var pokedexTextElements: JSX.Element[] = [];

	for (let pokedexTextElementsLoop: number = 0; pokedexTextElementsLoop < appState.questionState.pokedexEntryCount; pokedexTextElementsLoop++) {

		pokedexTextElements.push(<p><div>{appState.currentQuestion.pokedexEntries[pokedexTextElementsLoop]}</div></p>)

	}

	return (
		<div className="App">
			<div className="questionDisplay">
				<h1><div>{appState.currentQuestion.questionText}</div></h1>
				{pokedexTextElements}
				<RevealNewPokedexEntryButton/>
			</div>
			<div className="answerChoices">
				<span className="answerTilesSpan">
					{allPokemonElements}
				</span>
			</div>
		</div>
	);

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

		fetch('data/pokemon/' + correctPokemonID + '/pokedex.json')
			.then(fetchedData => fetchedData.json())
			.then((pokedexData: string[]) => {

				var newQuestion: QuestionData = { correctAnswer: correctPokemonID, pokedexEntries: pokedexData, possibleAnswers: pokemonList, questionText: "What species of Pok\u00e9mon is this Pok\u00e9dex entry describing?" }

				resolve(newQuestion);

			})

	});

}

export default App;
