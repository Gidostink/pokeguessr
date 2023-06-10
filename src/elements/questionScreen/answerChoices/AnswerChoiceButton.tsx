import React from 'react';
import { getCurrentURL } from '../../..';
import { AppStateType, getAppStateGlobal } from '../../../App';
import { PokemonData } from '../../../pokemonData';
import { setSelectedAnswerChoice } from '../QuestionScreen';

/** 
 * React Component: A button for selecting a Pokémon to guess. Clicking it sets the selected Pokémon in the appState's questionState to its ID.
 * @param param0
 * @returns
 */
function PokemonAnswerChoiceButton({ pokemonID }: {pokemonID: string} ): JSX.Element {

	let appState: AppStateType = getAppStateGlobal();

	if (!appState.currentQuestion || !appState.questionState) {

		console.error("There should be a currentQuestion and a questionState in the AppState when an AnswerChoiceButton component is created.")
		return <></>;

	}

	function handleClick() {

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


	return (<button className={buttonClass} onClick={handleClick}>

		<img src={imagePath} alt={`${pokemonData.name}'s Artwork'`} />
		<br/><b>{pokemonData.name}</b>
		<br/><i>#{pokemonData.pokemonID.substring(2)}</i>
		

	</button>)
}

export default PokemonAnswerChoiceButton;