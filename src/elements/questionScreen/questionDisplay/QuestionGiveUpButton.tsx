import React from 'react';
import { AppStateType, getAppStateGlobal, giveUpQuestion } from '../../../App';


function QuestionGiveUpButton(): JSX.Element {

	function handleClick() {
		giveUpQuestion();
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

	return (<button className="giveUpButton" onClick={handleClick} >

		Give up! (Reveals Answer)

	</button>)
}

export default QuestionGiveUpButton;