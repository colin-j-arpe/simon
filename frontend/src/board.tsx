import React from 'react';

// import tones from './audio.js';
import './Styles/board.css';
// import {useAudio} from './hooks';

// import * as toneFiles from "./Audio/*";
const greenTone = require("./Audio/tone3_Bb.wav");
const redTone = require("./Audio/tone2_F.wav");
const blueTone = require("./Audio/tone0_Bb.wav");
const yellowTone = require("./Audio/tone1_Db.wav");
const failTone = require("./Audio/tone4_Ab.wav");

const toneObjs = [
	new Audio(greenTone.default),
	new Audio(redTone.default),
	new Audio(blueTone.default),
	new Audio(yellowTone.default),
	new Audio(failTone.default)
];
toneObjs.forEach(tone => tone.loop = true);

const buttons = ['green', 'red', 'blue', 'yellow'];

function Button({color, beeping, index, onClick}: {
	color:string;
	beeping:boolean;
	index:number;
	onClick:(i:number)=>void
})	{
	return (
		<div 
			className={"game-button" + (beeping ? ' game-button-beeping' : '')} 
			style={{backgroundColor:color, transform:`rotate(${index*90}deg)`}} 
			onClick={() => onClick(index)}
		/>
	);
}

function Board({currentBeep, volume, listening, readClick}: {
	currentBeep:number; 
	volume:number; 
	listening:boolean; 
	readClick:(i:number)=>void;
})	{
	const tones = React.useRef<HTMLAudioElement[]>(toneObjs);
	const toneReducer = (prev:number, next:number) => {
		if (typeof prev === 'number' && prev !== -1) {
			tones.current[prev].pause();
			tones.current[prev].currentTime = 0;
		}

		if (typeof next === 'number' && next !== -1) {
			tones.current[next].currentTime = 0;
			tones.current[next].play();
		}	else 	{
			tones.current.forEach(tone => {
				tone.pause();
				tone.currentTime = 0;
			});
		}

		return next;
	}
	const [playing, setPlaying] = React.useReducer(toneReducer, -1);

	React.useEffect(() => {
		setPlaying(currentBeep);
	}, [currentBeep]);

	React.useEffect(() => {
		tones.current.forEach(tone => tone.volume = volume);
	}, [volume]);

	const clickBeep = React.useRef<number|null>(null);

	function click(index:number) {
		if (!listening) return;

		readClick(index);
		clickBeep.current = currentBeep === 4 ? 4 : index;
		tones.current[index].play();
		setTimeout(() => {
			clickBeep.current = null;
			tones.current[index].pause();
			tones.current[index].currentTime = 0;
		}, 250);
	}

	return (
		<div className="game-board">
			{buttons.map((button:string, index:number) => {
				return (
					<Button 
						key={button} 
						index={index} 
						color={button} 
						beeping={index === (clickBeep.current ?? playing)} 
						onClick={click} 
					/>
				);
			})}
		</div>
	);
}

export default Board;