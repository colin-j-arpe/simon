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
		volume: 0.1
	});

	const timing = React.useMemo(() => {
		return {
			beepDuration: (options.timingFactor + 1) * 250,
			beepInterval: options.timingFactor * 200,
			inputInterval: (options.timingFactor + 1) * 500
		}
	}, [options.timingFactor]);

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

	const nextTurn = React.useCallback(() : void => {
		setTimeout(() => {
			updateSequence();
			setGameState.show(roundScore.current);
			roundScore.current = 0;
		}, timing.beepDuration);
	}, [updateSequence, setGameState, roundScore, timing])

	function startGame() : void {
		resetGame();
		updateSequence();
		setGameState.start();
	}

// React.useEffect(()=>{console.log("seqIndex changed:", seqIndex);}, [seqIndex])
	function readClick(button:number) : void {
		if (button === sequence[seqIndex]) {
			roundScore.current++;
			incrementSeqIndex();
		}	else 	{
			setGameState.end(roundScore.current);
		}
	}

	const beepSet = React.useRef<boolean>(false);
	const toggleBeep = React.useCallback(() : void => {
		if (beepSet.current) return;

		if (beeping) {
			setTimeout(() => {
				incrementSeqIndex();
				beepSet.current = false;
			}, timing.beepDuration);
		} else {
			setTimeout(() => {
				beep();
				beepSet.current = false;
			}, timing.beepInterval);
		}

		beepSet.current = true;
	}, [beepSet, beeping, timing, beep, incrementSeqIndex]);

	React.useEffect(() => {
		if (gameState.showing && sequence.length) {
			if (seqIndex >= sequence.length) {
				resetSeqIndex();
				setGameState.listen();
			}	else 	{
				toggleBeep();
			}
		}
	}, [gameState, setGameState, sequence, seqIndex, resetSeqIndex, beeping, toggleBeep]);


	React.useEffect(() => {
		if (gameState.listening && seqIndex === sequence.length) {
			nextTurn();
		}
	}, [gameState, sequence, seqIndex, nextTurn]);

	return (
		<>
			<Board 
				currentBeep={gameState.ending ? 4 : beeping ? sequence[seqIndex] : -1} 
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