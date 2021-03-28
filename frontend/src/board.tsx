import React from 'react';
import './board.css';

const colors = ['green', 'red', 'blue', 'yellow'];

function Button({color, index})	{
	return (
		<div className="gameButton" style={{backgroundColor:color, transform:`rotate(${index*90}deg)`}} />
	);
}

function Board({sequence, beepDuration, nextTurn, reset, gameState, setGameState})	{
	const [buttons, setButtons] = React.useState<[]>(colors.map(color => {return {color: color, beeping: false}}));

	function displaySequence() : void {
		let i = 0;
		let displaying = setInterval(() => {
			beep(sequence[i++]);
			if (i === sequence.length) {
				clearInterval(displaying);
			}
		}, beepDuration);

	}

	function beep(index:number, failed = false) : void {
		const newButtons = [...buttons];
		newButtons[index]['beeping'] = true;
		setButtons(newButtons);
		setTimeout(() => {
			newButtons[index]['beeping'] = false;
			setBeeping(newButtons);
		}, beepDuration);
	}

	if (gameState.showing) {
		displaySequence();
	}

	return (
		<div className="gameBoard">
			{buttons.map((button, index) => (<Button key={button.color} index={index} color={button.color} beeping={button.beeping} />))}
		</div>
	);
}

export default Board;