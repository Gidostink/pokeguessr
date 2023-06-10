import React, { BaseSyntheticEvent } from 'react';
import { AppStateType, getAppStateGlobal, setAppStateGlobal } from '../../App';
import { deepCloneObject } from '../../commonFunctions';
import { TEMP_generateNewQuestion } from '../../App';
import { submitSelectedAnswer } from './QuestionScreen';

function QuestionNextButton(): JSX.Element {

	let appState: AppStateType = getAppStateGlobal();

	if (!appState.questionState) {
		return <button className="questionNextButton noAnswerSelected" disabled={true}>No Question State...</button>
	}

	if (appState.questionState.questionComplete) {
		return <NextQuestionButton />
	}

	if (!appState.questionState.selectedAnswerChoice) {
		return <NoAnswerSelectedButton/>
	}

	return <SubmitAnswerButton/>
}

function NoAnswerSelectedButton(): JSX.Element {

	return <button className="questionNextButton noAnswerSelected" disabled={true}>Submit Answer</button>

}

function SubmitAnswerButton(): JSX.Element {

	function handleClick(): void {

		submitSelectedAnswer();

	}

	return <button className="questionNextButton" onClick={handleClick}>Submit Answer</button>

}

function NextQuestionButton(): JSX.Element {

	function handleClick(): void {

		TEMP_generateNewQuestion();

	}

	return <button className="questionNextButton nextQuestion" onClick={handleClick}>Next Question</button>

}

export default QuestionNextButton;