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
function getDescription(code:number) : string	{
	for (var mode of gameModes) {
		if (mode.intCode === code) {
			return mode.description;
		}
	}
	return `Error: mode ${code} not found`;
}

function GameType(
	{current, update, disabled}: {
		current:number;
		update:(n:number)=>void;
		disabled:boolean;
	}
)	{
	return (
		<>
			<label htmlFor="game-mode-menu" className="game-options-label">Game Mode</label>
			<select 
				name="game-mode-menu" 
				className="game-type-select" 
				defaultValue={current} 
				onChange={e => update(parseInt(e.target.value))} 
				disabled={disabled}
			>
				{gameModes.map(mode => (
					<option 
						key={mode.name} 
						className="game-type-option" 
						value={mode.intCode}
					>
						{mode.displayName}
					</option>
				))}
			</select>
		</>
	);
}

function GameSpeed(
	{current, update, disabled}: {
		current:number;
		update:(n:number)=>void;
		disabled:boolean;
	}
)	{
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

function AudioVolume(
	{current, update}: {
		current:number;
		update:(n:number)=>void;
	}
)	{
	return (
		<>
			<label htmlFor="game-volume-slider" className="game-options-label">Audio Volume</label>
			<input 
				type="range" 
				name="game-volume-slider" 
				className="game-options-volume-input" 
				min={0} 
				max={1} 
				step={0.01} 
				value={current} 
				onChange={e => update(parseFloat(e.target.value))} 
			/>
		</>
	);
}

interface GameOptions {
	gameType:number; 
	newElementsPerTurn:number; 
	timingFactor:number;
	volume:number;
}

function Controls(
	{gameRunning, currentScore, options, timing, setOptions, startGame, resetGame}: {
		gameRunning:boolean;
		currentScore:number;
		options:{
			gameType:number;	//	-1: prepend; 1: append; 0: alternate/both
			newElementsPerTurn:number;
			timingFactor:number;
			volume:number;
		};
		timing:{
			beepDuration:number;
			beepInterval:number;
			inputInterval:number;
		};
		setOptions:(opts:GameOptions)=>void;
		startGame:()=>void;
		resetGame:()=>void;
	}
)	{
	return (
		<div className="game-options-container">
			<div className="game-options game-options-type">
				<GameType 
					current={options.gameType} 
					update={(newValue:number) => setOptions({...options, gameType: newValue})} 
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
					current={options.timingFactor} 
					update={(newValue:number) => setOptions({...options, timingFactor: newValue})} 
					disabled={gameRunning} 
				/>
				<div className="game-options-speed-desc game-options-text">
					<p>Display Step Duration: {timing.beepDuration}ms</p>
					<p>Display Step Interval: {timing.beepInterval}ms</p>
					<p>Input Time Allowed: {timing.inputInterval}ms</p>
				</div>
			</div>
			<div className="game-options game-options-volume">
				<AudioVolume 
					current={options.volume} 
					update={(newValue:number) => setOptions({...options, volume: newValue})} 
				/>
				<div className="game-options-speed-desc game-options-text">
					<p>Volume: {Math.floor(options.volume * 100)}</p>
				</div>
			</div>
			<div className="game-options game-options-io">
				<div className="game-options-io-score game-options-label">
					<p>Score: {currentScore}</p>
				</div>
				<div className="game-options-io-buttons game-options-label">
					<button 
						className="game-options-io-buttons-start" 
						onClick={startGame} 
						disabled={gameRunning}
					>Start Game</button>
					<button 
						className="game-options-io-buttons-reset" 
						onClick={resetGame} 
						disabled={!gameRunning}
					>Reset</button>
				</div>
			</div>
		</div>
	);
}

export default Controls;