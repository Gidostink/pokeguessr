import React from 'react';
import { addPokedexEntryToQuestionState, AppStateType, getAppStateGlobal } from '../../../App';


function RevealNewPokedexEntryButton(): JSX.Element {

	function handleClick() {
		addPokedexEntryToQuestionState();
	}

	var globalAppState: AppStateType = getAppStateGlobal();
	if (globalAppState.currentQuestion === null) {
		console.error("Current Question Data is null!");
		return <></>;
	}
	if (globalAppState.questionState === null) {
		console.error("Current Question State is null!");
		return <></>;
	}

	//Check if the question was already completed
	if (globalAppState.questionState.questionComplete) {

		return <></>;

	}

	if (globalAppState.questionState.pokedexEntryCount >= globalAppState.currentQuestion.pokedexEntries.length) {

		return(<p>

			That's every Pok{'\u00e9'}dex entry for this Pok{'\u00e9'}mon species! Good luck!

		</p>);
	}

	return (<button className="revealPokedexEntryButton" onClick={handleClick}>

		Reveal Another Pok{'\u00e9'}dex Entry

	</button>)
}

export default RevealNewPokedexEntryButton;