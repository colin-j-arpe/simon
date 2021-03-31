import React from 'react';

import {useGameState, useSequence} from './hooks';
import Board from './board';
import Controls from './controls';

function Simon()	{
	const [options, setOptions] = React.useState<{
		gameType:number;	//	-1: prepend; 1: append; 0: alternate/both
		newElementsPerTurn:number;
		timingFactor:number;
		volume:number;
	}>({
		gameType: 1,
		newElementsPerTurn: 1,
		timingFactor: 1,
		volume: 0.25
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

	const roundScore = React.useRef(0);

	function resetGame() : void	{
		setGameState.end();
		resetSequence();
	}

	function nextTurn() : void	{
		setTimeout(() => {
			updateSequence();
			setGameState.show(roundScore.current);
		}, timing.beepDuration);
	}

	function startGame() : void {
		resetGame();
		updateSequence();
		setGameState.start();
	}

	function readClick(button:number) : void {
		if (button === sequence[seqIndex]) {
			roundScore.current++;
			incrementSeqIndex();
		}	else 	{
			setGameState.end(roundScore.current);
		}
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
			roundScore.current = 0;
			resetSeqIndex();
		}
	}, [gameState.showing, beeping]);

	React.useEffect(() => {
		if (gameState.listening && seqIndex === sequence.length) {
			nextTurn();
		}
	}, [seqIndex]);

	return (
		<>
			<Board 
				currentBeep={beeping ? sequence[seqIndex] : -1} 
				volume={options.volume} 
				listening={gameState.listening}
				readClick={readClick}
			/>
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