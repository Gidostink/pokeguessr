import React from 'react';
import { getCurrentURL } from '../../..';
import App, { AppStateType, getAppStateGlobal } from '../../../App';
import { PokemonData } from '../../../pokemonData';
import { setSelectedAnswerChoice } from '../QuestionScreen';

/** 
 * React Component: A button for selecting a Pokémon to guess. Clicking it sets the selected Pokémon in the appState's questionState to its ID.
 * @param param0
 * @returns
 */
function PokemonAnswerChoiceButton({ pokemonID }: {pokemonID: string} ): JSX.Element {

	let appState: AppStateType = getAppStateGlobal();
	let shouldButtonBeDisabled: boolean = false;

	if (!appState.currentQuestion || !appState.questionState) {

		console.error("There should be a currentQuestion and a questionState in the AppState when an AnswerChoiceButton component is created.")
		return <></>;

	}

	function handleClick() {

		let appState = getAppStateGlobal();

		if (!appState.questionState) {

			console.error("Why isn't there a question state already?");
			return;

		}

		//Make sure the question isn't already complete before selecting this answer choice.
		if (appState.questionState.questionComplete) {

			console.debug("Button click ignored... This question is already complete.");
			return;

		}

		//Make sure this answer choice hasn't been submitted before.
		if (appState.questionState.submittedAnswers.includes(pokemonID)) {
			console.debug("Button click ignored... This answer has already been submitted.");
			return;
		}


		setSelectedAnswerChoice(pokemonID);

	}

	var globalAppState: AppStateType = getAppStateGlobal();
	if (globalAppState.allPokemonData === null) {

		return <button className="answerChoiceButton">

			<img src="images/pokemon/missingPokemon.png" alt="" />
			<br /><b>MISSING: {pokemonID}</b>

		</button>;
	}

	var pokemonData: PokemonData = globalAppState.allPokemonData[pokemonID];

	var imagePath: string;

	if (pokemonData.imageURL) {
		imagePath = pokemonData.imageURL;
	} else {
		imagePath = "images/pokemon/" + pokemonID + "/default.png";
	}

	imagePath = getCurrentURL() + "/" + imagePath;


	//Add a class to highlight the button when the button is selected.
	let buttonClass: string = "answerChoiceButton";
	if (appState.questionState.selectedAnswerChoice === pokemonID) {
		buttonClass += " selectedAnswerChoice";
	}

	//Check if this answer has been submitted before.
	if (appState.questionState.submittedAnswers.includes(pokemonID)) {

		//If so, add a class to color it, based on its correctness.
		if (appState.currentQuestion.correctAnswer === pokemonID) {
			buttonClass += " submittedAnswerChoiceCorrect";
		} else {
			buttonClass += " submittedAnswerChoiceIncorrect";
		}

		shouldButtonBeDisabled = true;

	}


	return (<button className={buttonClass} onClick={handleClick} disabled={shouldButtonBeDisabled}>

		<img src={imagePath} alt={`${pokemonData.name}'s Artwork'`} />
		<br/><b>{pokemonData.name}</b>
		<br/><i>#{pokemonData.pokemonID.substring(2)}</i>
		

	</button>)
}

export default PokemonAnswerChoiceButton;