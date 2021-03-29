import React from 'react';

import Board from './board.tsx';
import Controls from './controls.tsx';

function useGameState()	{
	const [gameStatus, setGameStatus] = React.useState<{
		running:boolean;
		showing:boolean;
		listening:boolean;
		score:number;
	}>({
		running: false,
		showing: false,
		listening: false,
		score: 0
	});
	// const [running, setrunning] = React.useState(false);
	// const [showing, setShowing] = React.useState(false);
	// const [listening, setListening] = React.useState(false);
	// const [score, setScore] = React.useState(0);

	const showingToListening = () : void => {
		setGameStatus({
			...gameStatus,
			showing: false,
			listening: true
		})
	}

	const listeningToShowing = (newScore:number) : void => {
		setGameStatus({
			...gameStatus,
			showing: true,
			listening: false,
			score: newScore
		});
	}

	const startGame = () : void => {
		setGameStatus({
			...gameStatus,
			running: true,
			showing: true,
			score: 0
		});
	}

	const endGame = (newScore:number = null) : void  => {
		setGameStatus({
			running: false,
			showing: false,
			listening: false,
			score: newScore ?? gameStatus.score
		});
	}

	return [
		gameStatus,
		{
			start: () => startGame(),
			listen: () => showingToListening(),
			show: () => listeningToShowing(),
			end: () => endGame()
		}
	]
}

function useAddToEnd() : [addNextElementToEnd:boolean, invert:object]	{
	const [addNextElementToEnd, setAddNextElementToEnd] = React.useState<boolean>(true);

	const invert = () => setAddNextElementToEnd(!addNextElementToEnd);

	return [addNextElementToEnd, invert];
}

function useSequence(
	{gameType, newElementsPerTurn}: {
		gameType:number, 
		newElementsPerTurn:number
	}
) : [
	sequence:number[],
	nextSequence:object,
	reset:object
]	{
	const [sequence, setSequence] = React.useState<0|1|2|3[]>([]);
	const [append, invertAppend] = useAddToEnd(gameType > -1);

	const nextSequence = () : void => {
		const sequenceCopy = [...sequence];
		for (var i = 0; i < newElementsPerTurn; ++i) {
			if (append) {
				sequenceCopy.push(Math.floor(Math.random() * 4));
			}	else 	{
				sequenceCopy.unshift(Math.floor(Math.random() * 4));
			}
			if (gameType === 0) {
				invertAppend();
			}
		}

		setSequence(sequenceCopy);
	}

	const reset = () : void => {
		setSequence([]);
	}

	return [sequence, nextSequence, reset];
}


function Simon()	{
	const [options, setOptions] = React.useState<{
		gameType:-1|0|1,	//	-1: prepend; 1: append; 0: alternate/both
		newElementsPerTurn:1|2,
		timing: {
			beepDuration:number,
			beepInterval:number,
			inputInterval:number
		}
	}>({
		gameType: 1,
		newElementsPerTurn: 1,
		timing: {
			beepDuration: 500,
			beepInterval: 200,
			inputInterval: 1000
		}
	});

	const [gameSequence, updateSequence, resetSequence] = useSequence(options);
	const [gameState, setGameState] = useGameState<{}>(false);

	function resetGame() : void	{
		setGameState.end();
		resetSequence();
	}

	function nextTurn() : void	{
		updateSequence();
		setGameState.show();
	}

	function startGame() : void {
		resetGame();
		updateSequence();
		setGameState.start();
	}

	return (
		<>
			<Board sequence={gameSequence} timing={options.timing} nextTurn={nextTurn} reset={resetSequence} gameState={gameState} listen={() => setGameState.listen()} />
			<Controls gameRunning={gameState.running} currentScore={gameState.score} options={options} setOptions={setOptions} startGame={startGame} resetGame={resetGame} />
		</>
	);
}

export default Simon;