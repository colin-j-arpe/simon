import React from 'react';
import './controls.css';

const gameModes = [
	{
		name: 'classic',
		intCode: 1,
		displayName: 'Classic',
		description: 'Each new step will be added to the end of the sequence'
	},
	{
		name: 'inv',
		intCode: -1,
		displayName: 'Inverted',
		description: 'Each new step will be added to the beginning of the sequence'
	},
	{
		name: 'alt',
		intCode: 0,
		displayName: 'Alternating/Both',
		description: 'New step will alternate between being added to the end and to the beginning of the sequence; in "Double Up!" mode, one new step each will be added to the end and the beginning of the sequence'
	},
];
function getDescription(code)	{
	for (var mode of gameModes) {
		if (mode.intCode === code) {
			return mode.description;
		}
	}
	return `Error: mode ${code} not found`;
}

function GameType({current, update, disabled}) {
	return (
		<>
			<label htmlFor="game-mode-menu" className="game-options-label">Game Mode</label>
			<select name="game-mode-menu" className="game-type-select" onChange={e => update(e.target.value)} disabled={disabled}>
				{gameModes.map(mode => (<option key={mode.name} className="game-type-option" value={mode.intCode} selected={current === mode.intCode}>{mode.displayName}</option>))}
			</select>
		</>
	);
}

function GameSpeed({current, update, disabled})	{
	return (
		<>
			<label htmlFor="game-speed-slider" className="game-options-label">Game Speed</label>
			<input 
				type="range" 
				name="game-speed-slider" 
				className="game-options-speed-input" 
				min={0} 
				max={3} 
				step={0.1} 
				value={current} 
				onChange={e => update(parseFloat(e.target.value))} 
			/>
		</>
	);
}

function Controls({gameRunning, currentScore, options, setOptions, startGame, resetGame})	{
	function updateSpeeds(factor)	{
		setOptions({
			...options,
			beepDuration: (factor + 1) * 250,
			beepInterval: factor * 100,
			inputInterval: (factor + 1) * 500
		});
	}

	return (
		<div className="game-options-container">
			<div className="game-options game-options-type">
				<GameType 
					current={options.gameType} 
					update={newValue => setOptions({...options, gameType: parseInt(newValue)})} 
					disabled={gameRunning}
				/>
				<div className="game-options-type-desc game-options-text">{getDescription(options.gameType)}</div>
			</div>
			<div className="game-options game-options-double">
				<input 
					type="checkbox"
					name="double-up-checkbox"
					className="game-options-double-input"
					value={1}
					checked={options.newElementsPerTurn === 2}
					onChange={e => {setOptions({...options, newElementsPerTurn: e.target.checked ? 2 : 1})}}
				/>
				<label htmlFor="double-up-checkbox" className="game-options-label">Double Up!</label>
				<div className="game-options-double-desc game-options-text">
					Add two additional steps to the sequence for each turn
				</div>
			</div>
			<div className="game-options game-options-speed">
				<GameSpeed 
					current={options.beepInterval / 100} 
					update={updateSpeeds} 
					disabled={gameRunning} 
				/>
				<div className="game-options-speed-desc game-options-text">
					<p>Display Step Duration: {parseInt(options.beepDuration)}ms</p>
					<p>Display Step Interval: {parseInt(options.beepInterval)}ms</p>
					<p>Input Time Allowed: {parseInt(options.inputInterval)}ms</p>
				</div>
			</div>
			<div className="game-options game-options-io">
				<div className="game-options-io-score game-options-label">
					<p>Score: {currentScore}</p>
				</div>
				<div className="game-options-io-buttons game-options-label">
					<button className="game-options-io-buttons-start" onClick={startGame} disabled={gameRunning}>Start Game</button>
					<button className="game-options-io-buttons-reset" onClick={resetGame} disabled={!gameRunning}>Reset</button>
				</div>
			</div>
		</div>
	);
}

export default Controls;