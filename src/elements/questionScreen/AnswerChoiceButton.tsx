import React from 'react';
import { AppStateType, getAppStateGlobal } from '../../App';
import { PokemonData } from '../../pokemonData';


function PokemonAnswerChoiceButton({ pokemonID }: {pokemonID: string} ): JSX.Element {

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


	return (<button className="answerChoiceButton">

		<img src={imagePath} alt={`Artwork of ${pokemonData.name}`} />
		<br/><b>{pokemonData.name}</b>
		<br /><i>#{pokemonData.pokemonID.substring(2)}</i>

	</button>)
}

export default PokemonAnswerChoiceButton;