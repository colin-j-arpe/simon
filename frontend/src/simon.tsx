import React from 'react';

import Board from './board.tsx';
import Controls from './controls.tsx';

function useGameState()	{
	const [gameOn, setGameOn] = React.useState(false);
	const [showing, setShowing] = React.useState(false);
	const [listening, setListening] = React.useState(false);

	const showingToListening = () => {
		setShowing(false);
		setListening(true);
	}

	const listeningToShowing = () => {
		setListening(false);
		setShowing(true);
	}

	const startGame = () => {
		setGameOn(true);
		setShowing(true);
	}

	const endGame = () => {
		setListening(false);
		setGameOn(false);
	}

	return [
		{
			running: gameOn,
			showing: showing,
			listening: listening
		},
		{
			start: startGame,
			show: listeningToShowing,
			listen: showingToListening,
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
		beepDuration:number
	}>({
		gameType: 1,
		newElementsPerTurn: 1,
		beepDuration: 500
	});

	const [gameSequence, updateSequence, resetSequence] = useSequence(options);
	const [gameState, setGameState] = useGameState<{}>(false);

	return (
		<>
			<Board sequence={gameSequence} beepDuration={options.beepDuration} nextTurn={updateSequence} reset={resetSequence} gameState={gameState} setGameState={setGameState} />
			<Controls setOptions={setOptions} />
		</>
	);
}

export default Simon;