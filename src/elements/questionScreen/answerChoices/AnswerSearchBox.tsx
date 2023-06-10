import React, { BaseSyntheticEvent } from 'react';
import { AppStateType, getAppStateGlobal, setAppStateGlobal } from '../../../App';
import { deepCloneObject } from '../../../commonFunctions';

/** 
 * React Component: An input field to filter though large amounts of answers. When typed in, it will change the appState's questionState's currentSearchQuery.
 * @param param0
 * @returns
 */
function PokemonSearchInputBox(): JSX.Element {

	function handleInput(event: BaseSyntheticEvent) {

		let appState: AppStateType = getAppStateGlobal();
		let newState: AppStateType = deepCloneObject(appState);

		if (!newState.questionState) {
			console.error("There's no Question State!!")
			return;
		}

		newState.questionState.currentSearchQuery = event.target.value;

		setAppStateGlobal(newState);

	}

	const placeholderText = "Search/Filter Pok\u00e9mon"
	
	return <input type="text" id="pokemonSearch" name="pokemonSearch" className="pokemonSearch" placeholder={placeholderText} onInput={handleInput} />;
}

export default PokemonSearchInputBox;