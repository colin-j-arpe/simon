import React from 'react';

// import tones from './audio.js';
import './board.css';
// import {useAudio} from './hooks';

// import * as toneFiles from "./Audio/*";
const greenTone = require("./Audio/tone3_Bb.wav");
const redTone = require("./Audio/tone2_F.wav");
const blueTone = require("./Audio/tone0_Bb.wav");
const yellowTone = require("./Audio/tone1_Db.wav");
const failTone = require("./Audio/tone4_Ab.wav");

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

function Board({currentBeep: newBeep, volume, readClick}: {
	currentBeep:number; 
	volume:number; 
	readClick:(i:number)=>void;
})	{
	const beep = React.useRef(-1);

	const tones = React.useRef([
		new Audio(greenTone.default),
		new Audio(redTone.default),
		new Audio(blueTone.default),
		new Audio(yellowTone.default),
		new Audio(failTone.default)
	]);

	React.useEffect(() => {
		if ((newBeep === -1 || typeof newBeep !== 'number') && beep.current > -1) {
			tones.current[beep.current].pause();
			tones.current[beep.current].currentTime = 0;
		}	else if (newBeep > -1) 	{
			tones.current[newBeep].play();
		}
		beep.current = newBeep;
	}, [newBeep])

	React.useEffect(() => {
		tones.current.forEach(tone => tone.volume = volume);
	}, [volume]);

	function click(index:number) {
		readClick(index);
		tones.current[index].play();
		setTimeout(() => {
			tones.current[index].pause();
			tones.current[index].currentTime = 0;
		}, 200);
	}

	return (
		<div className="game-board">
			{buttons.map((button:string, index:number) => (<Button key={button} index={index} color={button} beeping={index === newBeep} onClick={click} />))}
		</div>
	);
}

export default Board;