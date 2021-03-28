import React from 'react';

import Board from './board.tsx';
import Controls from './controls.tsx';

function useGameState()	{
	const [gameOn, setGameOn] = React.useState(false);
	const [showing, setShowing] = React.useState(false);
	const [listening, setListening] = React.useState(false);
	const [score, setScore] = React.useState(0);

	const showingToListening = () => {
		setShowing(false);
		setListening(true);
	}

	const listeningToShowing = newScore => {
		setScore(newScore);
		setListening(false);
		setShowing(true);
	}

	const startGame = () => {
		setScore(0);
		setGameOn(true);
		setShowing(true);
	}

	const endGame = (newScore = null) => {
		setScore(newScore ?? score);
		setShowing(false);
		setListening(false);
		setGameOn(false);
	}

	return [
		{
			running: gameOn,
			showing: showing,
			listening: listening, 
			score: score
		},
		{
			start: startGame,
			listen: showingToListening,
			show: listeningToShowing,
			end: endGame
		}
	]
}

function useAddToEnd()	{
	const [addNextElementToEnd, setAddNextElementToEnd] = React.useState<boolean>(true);

	const invert = () => setAddNextElementToEnd(!addNextElementToEnd);

	return [addNextElementToEnd, invert];
}

function useSequence({gameType, newElementsPerTurn})	{
	const [sequence, setSequence] = React.useState<0|1|2|3[]>([]);
	const [append, invertAppend] = useAddToEnd(gameType > -1);

	const addToSequence = () => {
		const nextElement = Math.floor(Math.random() * 4);
		if (append) {
			setSequence([...sequence, nextElement]);
		}	else 	{
			setSequence([nextElement, ...sequence]);
		}

		if (gameType === 0) {
			invertAppend();
		}
	}

	const nextSequence = () => {
		for (var i = 0; i < newElementsPerTurn; ++i) {
			addToSequence();
		}
	}

	const reset = () => {
		setSequence([]);
	}

	return [sequence, nextSequence, reset];
}


function Simon()	{
	const [options, setOptions] = React.useState<{
		gameType:-1|0|1,	//	-1: prepend; 1: append; 0: alternate/both
		newElementsPerTurn:1|2,
		beepDuration:number,
		beepInterval:number,
		inputInterval:number
	}>({
		gameType: 1,
		newElementsPerTurn: 1,
		beepDuration: 500,
		beepInterval:100,
		inputInterval:1000
	});

	const [gameSequence, updateSequence, resetSequence] = useSequence(options);
	const [gameState, setGameState] = useGameState<{}>(false);

	function nextTurn()	{
		updateSequence();
		gameState.show();
	}

	function resetGame()	{
		gameState.endGame();
		resetSequence();
	}

	return (
		<>
			<Board sequence={gameSequence} beepDuration={options.beepDuration} nextTurn={nextTurn} reset={resetSequence} gameState={gameState} setGameState={setGameState} />
			<Controls gameRunning={gameState.running} currentScore={gameState.score} options={options} setOptions={setOptions} startGame={setGameState.start} resetGame={resetGame} />
		</>
	);
}

export default Simon;