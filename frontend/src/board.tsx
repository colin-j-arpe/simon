import React from 'react';

import './board.css';
// import {useAudio} from './hooks.tsx';

import greenTone from "./Audio/tone3_Bb.wav";
import redTone from "./Audio/tone2_F.wav";
import blueTone from "./Audio/tone0_Bb.wav";
import yellowTone from "./Audio/tone1_Db.wav";
import failTone from "./Audio/tone4_Ab.wav";

const buttons = ['green', 'red', 'blue', 'yellow'];

const tones = [
	new Audio(greenTone), 
	new Audio(redTone), 
	new Audio(blueTone), 
	new Audio(yellowTone), 
	new Audio(failTone)
];

function Button({color, beeping, index})	{
	return (
		<div className={"game-button" + (beeping ? ' game-button-beeping' : '')} style={{backgroundColor:color, transform:`rotate(${index*90}deg)`}} />
	);
}

function Board({currentBeep}: {currentBeep:number})	{
	// const [playAudio, stopAudio] = useAudio();
	
	React.useEffect(() => {
		if (currentBeep === -1) {
			tones.forEach(tone => {
				tone.pause();
				tone.currentTime = 0;
			});
		}	else 	{
			tones[currentBeep].play();
		}
	}, [currentBeep])

	// if (currentBeep === -1) {
	// 	stopAudio();
	// }
	// playAudio(currentBeep);

	return (
		<div className="game-board">
			{buttons.map((button, index) => (<Button key={button} index={index} color={button} beeping={index === currentBeep} />))}
		</div>
	);
}

export default Board;