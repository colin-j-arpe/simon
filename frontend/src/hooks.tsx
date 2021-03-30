import React from 'react';

function useGameState() : [
	gameStatus:{
		running:boolean;
		showing:boolean;
		listening:boolean;
		score:number;
	},
	setGameStatus:{
		start:()=>void;
		listen:()=>void;
		show:(s:number)=>void;
		end:(s?:number)=>void;
	}
]	{
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

	const showingToListening = () : void => {
		setGameStatus({
			...gameStatus,
			showing: false,
			listening: true
		});
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
			start: startGame,
			listen: showingToListening,
			show: listeningToShowing,
			end: endGame
		}
	]
}

function useSequence(
	{gameType, newElementsPerTurn}: {
		gameType:number, 
		newElementsPerTurn:number
	}
) : [
	sequence:number[],
	addToSequence:()=>void,
	resetSequence:()=>void,
	currentIndex:number,
	incrementIndex:()=>void,
	resetIndex:()=>void,
	beeping:boolean,
	beep:()=>void
]	{
	const [sequence, setSequence] = React.useState<0|1|2|3[]>([3,2,3,2]);
	const [append, setAppend] = React.useState<boolean>(gameType > -1);
	const [currentIndex, setCurrentIndex] = React.useState<number>(0);
	const [beeping, setBeeping] = React.useState<boolean>(false);

	const addToSequence = () : void => {
		setCurrentIndex(0);

		const sequenceCopy = [...sequence];
		for (var i = 0; i < newElementsPerTurn; ++i) {
			if (append) {
				sequenceCopy.push(Math.floor(Math.random() * 4));
			}	else 	{
				sequenceCopy.unshift(Math.floor(Math.random() * 4));
			}
			if (gameType === 0) {
				setAppend(!append);
			}
		}

		setSequence(sequenceCopy);
	}

	const resetSequence = () : void => {
		setCurrentIndex(0);
		setBeeping(false);
		setSequence([]);
	}

	const incrementIndex = () : void => {
		setBeeping(false);
		setCurrentIndex(currentIndex + 1);
	}

	const resetIndex = () : void => {
		setBeeping(false);
		setCurrentIndex(0);
	}

	const beep = () => {
		setBeeping(true);
	}

	return [
		sequence, 
		addToSequence, 
		resetSequence,
		currentIndex, 
		incrementIndex, 
		resetIndex, 
		beeping, 
		beep 
	];
}

export {useGameState, useSequence}