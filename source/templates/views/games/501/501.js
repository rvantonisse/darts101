/* 
** 501.js 
** A game of 501 darts
** A match has sets
** A set has legs
** A leg has points
** Points can be scored in a turn
** A leg === 1 game
*/
var DARTS101 = DARTS101 || {};
DARTS101.game501 = function (DARTS101) {
	'use strict';
	var help = DARTS101.helpers;
	var template = {
		"submitButton": DARTS101.scoreInput.template.submitButton,
		"gameInfo": DARTS101.gameInfo.template,
		"playerInfo": DARTS101.playerInfo.template
	};
	var control = {
		"submitScore": DARTS101.scoreInput.submitScore,
		"clearScore": DARTS101.scoreInput.clearScore
	};
	var APP = {
		meta: {
			type: "X01",
			version: "501"
		},
		settings: {
			points: 501,
			sets: 3,
			legs: 5,
			players: 1
		},
		gameInfo: DARTS101.gameInfo,
		players: DARTS101.playerInfo
	};
	var game = APP.gameInfo.createGame(APP.meta, APP.settings);
	game.players = APP.players.create(game.settings.players);

	// Add game specific data to players
	for (var player in game.players) {
		// Add remaining score
		game.players[player].points = game.settings.points;
		// A player plays matches
		// A match has sets
		// A set has legs
		// A leg has scores
		/*
		var matches = [
			{
				sets: [
					{
						legs: [
							{
								finished: boolean,
								scores: [
									{
										scored: number,
										remaining: number
									}
								]
							}
						]
					}
				]
			}
		];
		*/
		// Add matches records to players
		game.players[player].matches = [];
	}
	// Initiate the game
	function init501 () {
		drawGame();
		startMatch();
		// console.log(game.players);
	}
	function drawGame () {
		// Drawing the game
		// console.log('Draw the game!');
		// Draw game info
		template.gameInfo.gameSets.innerText = game.state.currentSet;
		template.gameInfo.gameLegs.innerText = game.state.currentLeg;
		template.gameInfo.gameTurn.innerText = game.state.currentTurn;

		// Draw player info
		template.playerInfo.playerName.innerText = game.players[1].name;
		template.playerInfo.playerPoints.dataset.value = game.players[1].points;
		template.playerInfo.playerSets.dataset.value = game.players[1].currentMatch.setsWon;
		template.playerInfo.playerLegs.dataset.value = game.players[1].currentMatch.legsWon;
	}




	// Starting the match
	function startMatch () {
		// console.log('Starting match');
		game.state.hasStarted = true;
		game.state.currentSet = 1;
		game.state.currentTurn = 1;

		if(game.state.hasStarted) {
			// console.log("Game on, 501!");
			// Push a new match record
			startSet();
		}
	}
	// Ending the game;
	function endMatch () {
		// console.log('Ending match');
		game.state.hasStarted = false;
		// console.log('Game has ended!');
	}
	function nextMatch () {
		// console.log('Next match');
		game.state.currentMatch += 1;
		startMatch();
	}



	// Start a new set series
	function startSet () {
		// console.log('Starting set');
		// Check if game has started and 
		// if there is still a set to be played
		if(game.state.hasStarted && gameHasSets()) {
			startLeg();
		}
		// If all sets have been played, end the set series
		if (!gameHasSets()) {
			endMatch();
		}
	}
	// Check for playable set
	function gameHasSets () {
		return (game.state.currentSet <= game.settings.sets);
	}
	// End a set series, start game ending
	function endSet () {
		// console.log('Ending set');
		resetLeg();
		nextSet();
	}
	// Setup for the next set
	function nextSet () {
		// console.log('Next set');
		game.state.currentSet += 1;
		startSet();
	}



	// Start a new series of legs
	function startLeg () {
		// console.log('Starting leg');
		resetTurn();
		resetPlayerPoints();
		if (game.state.hasStarted && setHasLegs()) {
			startTurn();
		}
		if (!setHasLegs()) {
			endSet();
		}
	}
	// Validate if there should be another leg played within the set
	function setHasLegs () {
		return (game.state.currentLeg <= game.settings.legs);
	}
	// End a leg, continue to the next set
	function endLeg () {
		// console.log('Ending leg');
		nextLeg();
	}
	// Setup to start a new leg
	function nextLeg () {
		// console.log('Next leg');
		game.state.currentLeg += 1;
		startLeg();
	}

	function resetLeg () {
		game.state.currentLeg = 1;
		game.players[getCurrentPlayer()].currentMatch.legsWon = 0;
	}


	// Start the turn based play
	function startTurn () {
		// console.log('Starting turn');
		game.state.currentPlayer = 1;
		updatePlayerInfo();
		updateGameInfo();
		if (!playerHasPoints()) {

		}
	}
	// End the turn based play; 
	// the game has finished
	function endTurn () {
		// console.log('Ending turn');
		nextTurn();
	}
	function nextTurn () {
		// console.log('Next turn');
		game.state.currentTurn += 1;
		startTurn();
	}
	function resetTurn () {
		game.state.currentTurn = 1;
	}



	function playerIsScoring (score) {
		// console.log('Player is scoring: ' + score);
		// get remaining score
		var currentPlayer = getCurrentPlayer();
		var currentPoints = game.players[currentPlayer].getPoints();

		if (currentPoints - score < 0 || currentPoints - score === 1) {
			// Player scored to high, keep current points.
			game.players[currentPlayer].setPoints(currentPoints);
			updatePlayerInfo(currentPlayer);
			nextPlayer();
		}
		if (currentPoints - score === 0) {
			// Player finnished the leg
			game.players[currentPlayer].setPoints(currentPoints - score);
			updatePlayerInfo(currentPlayer);
			playerWinsLeg(currentPlayer);
		}
		if (currentPoints - score > 1) {
			// player still needs another turn to finish
			game.players[currentPlayer].setPoints(currentPoints - score);
			updatePlayerInfo(currentPlayer);
			nextPlayer();
		}
	}

	function updatePlayerInfo (player) {
		player = player || getCurrentPlayer();
		// console.log('Updating player info for ' + player);
		template.playerInfo.playerPoints.dataset.value = game.players[player].points;
		template.playerInfo.playerSets.dataset.value = game.players[1].currentMatch.setsWon;
		template.playerInfo.playerLegs.dataset.value = game.players[1].currentMatch.legsWon;
	}

	function resetPlayerPoints () {
		// console.log('Resetting player points');
		for (var player in game.players) {
			game.players[player].points = game.settings.points;
		}
	}

	function playerHasPoints () {
		var currentPlayer = getCurrentPlayer();
		var playerPoints = game.players[currentPlayer].getPoints();
		return (playerPoints > 1);
	}

	function getCurrentPlayer () {
		return game.state.currentPlayer;
	}

	function nextPlayer () {
		// console.log('Next player');
		updatePlayerInfo();		
		game.state.currentPlayer += 1;
		if (game.state.currentPlayer > game.settings.players) {
			endTurn();
		}
	}

	function playerWinsLeg (player) {
		var playerName = game.players[player].name;
		game.players[player].currentMatch.legsWon += 1;
		updatePlayerInfo(player);
		if (game.players[player].currentMatch.legsWon >= game.settings.legs) {
			playerWinsSet(player);
			return;
		}

		// Player has won
		// console.log(playerName + ' has won the leg!');
		endLeg();
	}

	function playerWinsSet (player) {
		var playerName = game.players[player].name;
		game.players[player].currentMatch.setsWon += 1;
		updatePlayerInfo(player);
		if (game.players[player].currentMatch.setsWon >= game.settings.sets) {
			playerWinsMatch(player);
			return;
		}

		// Player has won
		// console.log(playerName + ' has won the set!');
		endSet();
	}

	function playerWinsMatch (player) {
		var playerName = game.players[player].name;
		updatePlayerInfo(player);

		// Player has won
		// console.log(playerName + ' has won the match!');
		endMatch();
	}

	function updateGameInfo () {
		template.gameInfo.gameSets.innerText = game.state.currentSet;
		template.gameInfo.gameLegs.innerText = game.state.currentLeg;
		template.gameInfo.gameTurn.innerText = game.state.currentTurn;
	}


	// Press the score button
	template.submitButton.addEventListener('click', function (e) {
		// console.log('You pressed score.');
		var score = control.submitScore();
		if (score === false && score !== 0) {
			return false;
		}
		if (typeof score === 'number') {
			// player scores?
			playerIsScoring(score);
		}
	}, false);


	init501();
	return {
	};
};
// Only execute when needed to prevent errors and script blocking
if (DARTS101.helpers.el('.game-501')) {
	DARTS101.game501 = DARTS101.game501(DARTS101);
};
