import React from 'react';

function useGameState() : [
	gameStatus:{
		running:boolean;
		showing:boolean;
		listening:boolean;
		ending:boolean;
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
		ending:boolean;
		score:number;
	}>({
		running: false,
		showing: false,
		listening: false,
		ending:false,
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

	const endGame = (newScore:number|null = null) : void  => {
		const finalScore = 
			newScore && newScore > gameStatus.score 
				? newScore 
				: gameStatus.score;
		setGameStatus({
			running: false,
			showing: false,
			listening: false,
			ending:false,
			score: finalScore
		});
		// setTimeout(() => {
		// 	setGameStatus({
		// 		...gameStatus,
		// 		ending:false
		// 	});
		// }, 1000)
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

	const [sequence, setSequence] = React.useState<number[]>([]);
	const [currentIndex, setCurrentIndex] = React.useState<number>(0);
	const [beeping, setBeeping] = React.useState<boolean>(false);

	const append = React.useRef<boolean>(gameType > -1);

	const addToSequence = () : void => {
		const sequenceCopy = [...sequence];
		for (var i = 0; i < newElementsPerTurn; ++i) {
			if (append.current) {
				sequenceCopy.push(Math.floor(Math.random() * 4));
			}	else 	{
				sequenceCopy.unshift(Math.floor(Math.random() * 4));
			}
			if (gameType === 0) {
				append.current = !append.current;
			}
		}

		setSequence(sequenceCopy);
		setCurrentIndex(0);
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

	React.useEffect(() => {append.current = gameType > -1}, [gameType]);

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

// function useAudio()	: [
// 	tones:HTMLAudioElement[],
// 	playTone:(n:number)=>void,
// 	setVolume:(n:number)=>void,
// 	stopAudio:()=>void
// ]	{
// 	const greenTone = require("./Audio/tone3_Bb.wav");
// 	const redTone = require("./Audio/tone2_F.wav");
// 	const blueTone = require("./Audio/tone0_Bb.wav");
// 	const yellowTone = require("./Audio/tone1_Db.wav");
// 	const failTone = require("./Audio/tone4_Ab.wav");

// 	const [tones] = React.useState([
// 		new Audio(greenTone.default),
// 		new Audio(redTone.default),
// 		new Audio(blueTone.default),
// 		new Audio(yellowTone.default),
// 		new Audio(failTone.default)
// 	]);

// 	const setVolume = (volume:number) => {
// 		tones.forEach(tone => tone.volume = volume);
// 	}

// 	const playTone = (index:number) => tones[index].play();

// 	const stopAudio = () => {
// 		tones.forEach(tone => {
// 			tone.pause();
// 			tone.currentTime = 0;
// 		});
// 	}

// 	return [tones, playTone, setVolume, stopAudio];
// }

export {useGameState, useSequence}