import React from 'react';
import './board.css';

const colors = ['green', 'red', 'blue', 'yellow'];

function Button({color, beeping, index})	{
	return (
		<div className={"game-button" + (beeping ? ' game-button-beeping' : '')} style={{backgroundColor:color, transform:`rotate(${index*90}deg)`}} />
	);
}

function Board(
	{sequence, timing, nextTurn, reset, gameState, listen}: {
		sequence:number[],
		timing:object,
		nextTurn:object,
		reset:object,
		gameState:object,
		listen:object
	}
)	{
	const [buttons, setButtons] = React.useState<object[]>(colors.map(color => {return {color: color, beeping: false}}));
	const [seqIndex, setSeqIndex] = React.useState<number>(0);

	// function displaySequence() : void {

	// 		let displaying = setInterval(() => {
	// 			setTimeout(() => {
	// 				beep(sequence[i++]);
	// 				if (i === sequence.length) {
	// 					clearInterval(displaying);
	// 					setGameState.listen();
	// 				}
	// 			}, timing.beepInterval);
	// 		}, timing.beepDuration);

	// }

	// function beep(index:number, failed = false) : void {
	// 	const newButtons = [...buttons];
	// 	newButtons[index]['beeping'] = true;
	// 	setButtons(newButtons);
	// 	setTimeout(() => {
	// 		newButtons[index]['beeping'] = false;
	// 		setButtons(newButtons);
	// 	}, timing.beepDuration);
	// }


	if (gameState.showing && sequence.length) {
		if (seqIndex === sequence.length) {
			listen();
			setSeqIndex(0);
		}	else 	{
			if (buttons[seqIndex].beeping) {
				setTimeout(() => {
					const newButtons = [...buttons];
					newButtons[seqIndex].beeping = false;
					setButtons(newButtons);
					setSeqIndex(seqIndex + 1);
				}, timing.beepDuration);
			}	else 	{
				setTimeout(() => {
					const newButtons = [...buttons];
					newButtons[seqIndex].beeping = true;
					setButtons(newButtons);
				}, timing.beepInterval);
			}
		}
	}

	return (
		<div className="game-board">
			{buttons.map((button, index) => (<Button key={button.color} index={index} color={button.color} beeping={button.beeping} />))}
		</div>
	);
}

export default Board;