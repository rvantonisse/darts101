/*
** X01.js
** A game of X01 darts
** A match has sets
** A set has legs
** A leg has points
** Points can be scored in a turn
** A leg === 1 game
*/
var DARTS101 = DARTS101 || {};
DARTS101.gameX01 = function (DARTS101) {
	'use strict';
	var help = DARTS101.helpers;
	var gameX01 = {
		"init": function () {
			this.settings.startGame();

			APP = {
				"meta": {
					"type": "X01",
					"version": this.settings.getSetting('gameVariant')
				},
				"settings": {
					"points": parseInt(this.settings.getSetting('gameVariant'), 10),
					"sets": parseInt(this.settings.getSetting('sets'), 10),
					"legs": parseInt(this.settings.getSetting('legs'), 10),
					"players": parseInt(this.settings.getSetting('players'), 10)
				}
			};
			game = this.gameInfo.createGame(APP.meta, APP.settings);
			game.players = this.players.create(game.settings.players);
			if (game.settings.players > 1) {
				game.state.bestOf = true;
			}

			// Add game specific data to players
			for (var player in game.players) {
				// console.log(this.template.playerInfo);
				game.players[player].ID = parseInt(player, 10) + 1;
				game.players[player].template = this.template.playerInfo.players[player];
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
			// console.log(game.players);


			drawGame();
			startMatch();
		},
		"template": {
			"container": help.el('.game-X01'),
			"startButton": DARTS101.gameSettings.template.startButton,
			"scoreButton": DARTS101.scoreInput.template.submitButton,
			"gameInfo": DARTS101.gameInfo.template,
			"playerInfo": DARTS101.playerInfo.template
		},
		"settings": {
			"startGame": DARTS101.gameSettings.startGame,
			"endGame": DARTS101.gameSettings.endGame,
			"get": DARTS101.gameSettings.getGameSettings,
			"getSetting": DARTS101.gameSettings.getGameSetting,
			"setSetting": DARTS101.gameSettings.setGameSetting
		},
		"gameInfo": {
			"createGame": DARTS101.gameInfo.createGame
		},
		"players": DARTS101.playerInfo.control,
		"scoreInput": {
			"submitScore": DARTS101.scoreInput.submitScore,
			"clearScore": DARTS101.scoreInput.clearScore
		},
		"feedback": {
			"showMessage": DARTS101.messageBox.showMessage
		}

	};
	var APP = {};
	var game = {};
	// Initiate the game
	function drawGame () {
		// Drawing the game
		// console.log('Draw the game!');
		// Draw game info
		var gamePlayers = game.settings.players;
		var gameSets = game.settings.sets;
		var gameLegs = game.settings.legs;
		var gameSet = game.state.currentSet;
		var gameLeg = game.state.currentLeg;
		var gameVersion = game.meta.version +
			' (' + gameSets + ' sets & ' + gameLegs + ' legs)';
		var gameTemplate = gameX01.template;

		gameTemplate.gameInfo.gameVersion.dataset.version = gameVersion;
		gameTemplate.gameInfo.gameSets.innerText = gameSet;
		gameTemplate.gameInfo.gameLegs.innerText = gameLeg;
		gameTemplate.gameInfo.gameTurn.innerText = game.state.currentTurn;
		gameTemplate.playerInfo.container.dataset.players = gamePlayers;


		for (var player in game.players) {
			gameX01.players.draw(game.players[player]);
		}

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
		// End the game
		gameX01.settings.endGame();
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
		setStartingPlayer();
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
		for (var player in game.players) {
			var thisPlayer = game.players[player];
			thisPlayer.currentMatch.legsWon = 0;
			updatePlayerInfo(thisPlayer);
		}
	}


	// Start the turn based play
	function startTurn () {
		// console.log('Starting turn');
		updateGameInfo();
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
		for (var player in game.players) {
			var thisPlayer = game.players[player];
			thisPlayer.points = game.settings.points;
			updatePlayerInfo(thisPlayer);
		}
	}



	function playerIsScoring (score) {
		// console.log('Player is scoring: ' + score);
		// get remaining score
		var currentPlayer = getCurrentPlayer();
		var currentPoints = currentPlayer.points;
		score = parseInt(score, 10);
		function loopsiloop (timer, limit, callback) {

			currentPlayer.setPoints(currentPoints - timer);
			setTimeout(function () {
				timer = 1 + (timer * (1 + timer));
				updatePlayerInfo(currentPlayer);
				if (timer <= limit) {
					loopsiloop(timer, limit, callback);
				} else {
					currentPlayer.setPoints(currentPoints - limit);
					updatePlayerInfo(currentPlayer);
					setTimeout(function () {
						callback();
					},500)
				}
			},100);
		}

		if (currentPoints - score < 0 || currentPoints - score === 1) {
			// Player scored to high, keep current points.
			loopsiloop(0, score, function () {
				currentPlayer.setPoints(currentPoints);
				nextPlayer();
			});
			gameX01.feedback.showMessage('You scored too much!');
		}
		if (currentPoints - score === 0) {
			// Player finnished the leg
			loopsiloop(0, score, function () {
				playerWinsLeg(currentPlayer);
			});
		}
		if (currentPoints - score > 1) {
			// player still needs another turn to finish
			loopsiloop(0, score, function () {
				nextPlayer();
			});
		}
		game.state.isScoring = false;
	}

	function updatePlayerInfo (player) {
		var playerTemplate = {};
		player = player || getCurrentPlayer();
		playerTemplate = player.template;
		// console.log('Updating player info for ' + player);
		playerTemplate.points.dataset.value = player.points;
		playerTemplate.sets.dataset.value = player.currentMatch.setsWon;
		playerTemplate.legs.dataset.value = player.currentMatch.legsWon;
	}

	function resetPlayerPoints () {
		// console.log('Resetting player points');
		for (var player in game.players) {
			game.players[player].points = game.settings.points;
		}
	}

	function playerHasPoints (player) {
		var playerPoints = player.points;
		return (playerPoints > 1);
	}

	function getCurrentPlayer () {
		return game.players[0];
	}
	function setCurrentPlayer (playerID) {
		var players = game.players;

		// console.log('Current player is: ' + getCurrentPlayer().ID);
		// console.log('and will be changed to ' + playerID);
		if (players[0].ID !== playerID) {
			var shifted = players.shift();
			players.push(shifted);
		}
		game.players = players;
		// console.log('New current player is ' + getCurrentPlayer().ID);
	}

	function nextPlayer () {
		var currentPlayer = getCurrentPlayer();
		// console.log('Next player');
		updatePlayerInfo(currentPlayer);
		game.players.shift();
		game.players.push(currentPlayer);
		// console.log(game.players[0]);
		gameX01.template.playerInfo.container.dataset.activePlayer = getCurrentPlayer().ID;
		if (currentPlayer.ID === game.state.startingPlayer) {
			endTurn();
		}
	}

	function setStartingPlayer () {
		var startingPlayer = game.state.startingPlayer;
		var gamePlayers = game.settings.players;
		// console.log('Starting player is :' + startingPlayer);

		if (gamePlayers === 1) {
			game.state.startingPlayer = startingPlayer;
		}
		if (gamePlayers > 1) {
			switch (startingPlayer) {
				case 1:
					game.state.startingPlayer = 2;
				break;

				case 2:
					game.state.startingPlayer = 1;
				break;
			}
		}
		setCurrentPlayer(game.state.startingPlayer);
		gameX01.template.playerInfo.container.dataset.activePlayer = getCurrentPlayer().ID;
	}


	function playerWinsLeg (player) {
		var playerName = player.name;
		var turn = game.state.currentTurn;
		var msg = playerName + ' wins the leg';
		msg += ' on turn ' + turn;
		gameX01.feedback.showMessage(msg);
		player.currentMatch.legsWon += 1;
		updatePlayerInfo(player);
		if (game.state.bestOf && (player.currentMatch.legsWon >= (game.settings.legs/2))) {
			playerWinsSet(player);
			return;
		}
		if (player.currentMatch.legsWon >= game.settings.legs) {
			playerWinsSet(player);
			return;
		}

		// Player has won
		// console.log(playerName + ' has won the leg!');
		endLeg();
	}

	function playerWinsSet (player) {
		var playerName = player.name;
		var turn = game.state.currentTurn;
		var msg = playerName + ' wins the set';
		msg += ' on turn ' + turn;
		player.currentMatch.setsWon += 1;
		updatePlayerInfo(player);
		gameX01.feedback.showMessage(msg);
		if (game.state.bestOf && (player.currentMatch.setsWon >= (game.settings.sets/2))) {
			playerWinsMatch(player);
			return;
		}
		if (player.currentMatch.setsWon >= game.settings.sets) {
			playerWinsMatch(player);
			return;
		}

		// Player has won
		// console.log(playerName + ' has won the set!');
		endSet();
	}

	function playerWinsMatch (player) {
		var playerName = player.name;
		var turn = game.state.currentTurn;
		var msg = playerName + ' wins the game';
		msg += ' on turn ' + turn;
		updatePlayerInfo(player);
		gameX01.feedback.showMessage(msg);
		// Player has won
		// console.log(playerName + ' has won the match!');
		endMatch();
	}

	function updateGameInfo () {
		gameX01.template.gameInfo.gameSets.innerText = game.state.currentSet;
		gameX01.template.gameInfo.gameLegs.innerText = game.state.currentLeg;
		gameX01.template.gameInfo.gameTurn.innerText = game.state.currentTurn;
	}

	/*
	** FASTCLICK
	*/
	// console.log(template.container !== null);
	if ('addEventListener' in document && (gameX01.template.container !== null)) {
	    document.addEventListener('DOMContentLoaded', function() {
	        FastClick.attach(gameX01.template.container);
	    }, false);
	}


	// Press the score button
	gameX01.template.scoreButton.addEventListener('click', function (e) {
		// console.log('You pressed score.');
		var score = gameX01.scoreInput.submitScore();
		if (score === false && score !== 0) {
			return false;
		}
		if (game.state.isScoring) {
			return false;
		}
		if (typeof score === 'number') {
			// player scores?
			game.state.isScoring = true;
			playerIsScoring(score);
		}
	}, false);
	// Press the start game button
	gameX01.template.startButton.addEventListener('click', function (e) {
		gameX01.init();
	}, false);

	return {
	};
};
// Only execute when needed to prevent errors and script blocking
if (DARTS101.helpers.el('.game-X01')) {
	DARTS101.gameX01 = DARTS101.gameX01(DARTS101);
};
