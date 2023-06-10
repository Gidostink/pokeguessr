import { getCurrentURL } from ".";
import { AppScreen, appStateSetScreen, getAppStateGlobal, setAppStateGlobal, TEMP_generateNewQuestion } from "./App";
import { AppStateType } from "./App";
import { deepCloneObject } from "./commonFunctions";

export type PokemonData = {

	name: string,
	pokemonID: string,
	imageURL: string,

}

export type PokemonDataLoadedState = {
	dataInitalized: boolean,
	loadStarted: boolean,
	totalPokemonCount: number,
	pokemonLoadedCount: number
}

function setPokemonLoadedStateLoadStarted(): void {

	var newState: AppStateType = deepCloneObject(getAppStateGlobal());

	newState.pokemonDataLoadedState.loadStarted = true;

	setAppStateGlobal(newState);

}

function setPokemonLoadedStateTotalPokemon(totalPokemon: number): void {

	var newState: AppStateType = deepCloneObject(getAppStateGlobal());

	newState.pokemonDataLoadedState.totalPokemonCount = totalPokemon;

	setAppStateGlobal(newState);

}

function addPokemonLoadedStateLoadedPokemon(): void {

	var newState: AppStateType = deepCloneObject(getAppStateGlobal());

	newState.pokemonDataLoadedState.pokemonLoadedCount++;

	setAppStateGlobal(newState);

}

function setPokemonLoadedStateDataInitalized(): void {

	var newState: AppStateType = deepCloneObject(getAppStateGlobal());

	newState.pokemonDataLoadedState.dataInitalized = true;

	setAppStateGlobal(newState);

}

function setAllPokemonDataToAppState() {

	var newState: AppStateType = deepCloneObject(getAppStateGlobal());

	newState.allPokemonData = deepCloneObject(loadingPokemonData);

	setAppStateGlobal(newState);

}

function setAllPokemonListToAppState(pokeList: string[]) {

	var newState: AppStateType = deepCloneObject(getAppStateGlobal());

	newState.allPokemonList = pokeList;

	setAppStateGlobal(newState);

}

var loadingPokemonData: { [key: string]: PokemonData } = {};

export async function initAllPokemonData() {

	console.log("Beginning to import Pokemon.");

	loadingPokemonData = {};

	console.log("Getting Pokemon List!");

	fetch(getCurrentURL() + "/data/pokemonList.json")
		.then(fetchedData => fetchedData.json())
		.then((data) => {
			setAllPokemonListToAppState(data);
			getAllPokemonFiles(data)
		});


}

async function getAllPokemonFiles(pokemonIDsList: string[]) {

	console.log("Importing every Pokemon from the Pokemon list.");

	setPokemonLoadedStateTotalPokemon(pokemonIDsList.length);
	setPokemonLoadedStateLoadStarted();

	pokemonIDsList.forEach(importPokemonData);

}

async function importPokemonData(pokemonID: string) {

	//"Fetching data for pm160"
	console.debug("Fetching data for " + pokemonID);

	//Fetch the data json for this specific Pokemon.
	fetch(getCurrentURL() + "/data/pokemon/" + pokemonID + "/data.json")
		.then(fetchedData => fetchedData.json())
		.then((pokemonData) => {

			//Merge this data json with loadingPokemonData
			loadingPokemonData[pokemonID] = pokemonData;


			addPokemonLoadedStateLoadedPokemon();

			const pokemonLoadedState: PokemonDataLoadedState = getAppStateGlobal().pokemonDataLoadedState;

			//"Successfully added pm40 (Wigglytuff) to loadingPokemonData!!"
			console.debug("Successfully added " + pokemonID + " (" + pokemonData.name + ") to allPokemonData!!")



			if (pokemonLoadedState.pokemonLoadedCount >= pokemonLoadedState.totalPokemonCount) {
				
				console.log("Successfully Loaded all Pokemon Data! Yay!!");

				dataFinishedLoading();

			}

		});

}

export async function beginLoadingPokemon() {

	console.log("Starting fetch.")
	console.time("PokemonLoadTime");
	initAllPokemonData();

}
function dataFinishedLoading() {

	console.log("Sending Pokemon Data to the global AppState");

	setPokemonLoadedStateDataInitalized(); //Set the app state to have all data loaded.
	setAllPokemonDataToAppState(); //Copy all Pokemon Data to the App State


	loadingPokemonData = {}; //Erase the loadingPokemonData object, it saves a bit of memory.


	console.timeEnd("PokemonLoadTime");

	TEMP_generateNewQuestion();

}




//Filter functions!!!
export function filterPokemon(inputQuery: string, pokemonData: { [key: string]: PokemonData }, basePokemonList: string[]) {

	if (inputQuery.length < 1) {

		return basePokemonList;

	}


	return runFilter(checkFilterPokemonEntryByID, inputQuery, pokemonData, basePokemonList);


}

function runFilter(filterFunction: Function, inputQuery: string, pokemonData: { [key: string]: PokemonData }, basePokemonList: string[]) {



}

function checkFilterPokemonEntryByID(inputQuery: string, targetPokemonData: PokemonData ): boolean {

	var pokemonNumberID: string = targetPokemonData.pokemonID.substring(2, targetPokemonData.pokemonID.length);
	return inputQuery === pokemonNumberID;

}

function checkFilterPokemonEntryByStartName(inputQuery: string, targetPokemonData: PokemonData ): boolean {

	return false;

}

function checkFilterPokemonEntryByAnyPointName(inputQuery: string, pokemonData: PokemonData ): boolean {

	return false;

}