import React from 'react';

import {useGameState, useSequence} from './hooks.tsx';
import Board from './board.tsx';
import Controls from './controls.tsx';

function Simon()	{
	const [options, setOptions] = React.useState<{
		gameType:-1|0|1;	//	-1: prepend; 1: append; 0: alternate/both
		newElementsPerTurn:1|2;
		timingFactor:number;
	}>({
		gameType: 1,
		newElementsPerTurn: 2,
		timingFactor: 2
	});

	const timing = {
		beepDuration: (options.timingFactor + 1) * 250,
		beepInterval: options.timingFactor * 200,
		inputInterval: (options.timingFactor + 1) * 500
	};

	// const [timerRunning, timerComplete, runTimer] = useTimer();

	const [
		sequence, 
		updateSequence, 
		resetSequence,
		seqIndex, 
		incrementSeqIndex,
		resetSeqIndex,
		beeping, 
		beep
	] = useSequence(options);

	const [gameState, setGameState] = useGameState();

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

	React.useEffect(() => {
		if (gameState.showing && sequence.length) {
			if (seqIndex >= sequence.length) {
				resetSeqIndex();
				setGameState.listen();
			}	else 	{
				if (beeping) {
					setTimeout(() => {
						incrementSeqIndex();
					}, timing.beepDuration);
				}	else 	{
					setTimeout(() => {
						beep();
					}, timing.beepInterval);
				}
			}
		}

		if (gameState.listening) {
			resetSeqIndex();
		}
	}, [gameState.showing, beeping]);



	return (
		<>
			<Board currentBeep={beeping ? sequence[seqIndex] : -1} />
			<Controls 
				gameRunning={gameState.running} 
				currentScore={gameState.score} 
				options={options} 
				timing={timing} 
				setOptions={setOptions} 
				startGame={startGame} 
				resetGame={resetGame} 
			/>
		</>
	);
}

export default Simon;