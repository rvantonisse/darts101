/*
** player-info.js
** Handles the player object and the player info in games
*/
var DARTS101 = DARTS101 || {};
DARTS101.playerInfo = function (DARTS101) {
	var help = DARTS101.helpers || {};

	// Get template
	var template = {
		"container": help.el('.player-info-container'),
		"players": [
			{
				"container": help.el('.player-1'),
				"name": help.el('.player-1 .player-name'),
				"points": help.el('.player-1 .player-points'),
				"sets": help.el('.player-1 .player-sets'),
				"legs": help.el('.player-1 .player-legs')
			},
			{
				"container": help.el('.player-2'),
				"name": help.el('.player-2 .player-name'),
				"points": help.el('.player-2 .player-points'),
				"sets": help.el('.player-2 .player-sets'),
				"legs": help.el('.player-2 .player-legs')
			}
		]
	};

	// Create a player object
	function Player (name) {
		this.name = name;
		this.currentMatch = {
			setsWon: 0,
			legsWon: 0
		};
		this.points = 0;
		this.getPoints = function () {
			return this.points;
		};
		this.setPoints = function (newValue) {
			this.points = newValue;
		};
	}
	function createPlayer (name) {
		return new Player(name);
	}
	function createPlayers (amount, names) {
		var players = [];
		amount = amount || 1;
		names = names || [];
		for (var i = 0; i < amount; i++) {
			var name = names[i] || 'Player ' + (1+i);
			players.push(createPlayer(name));
			// console.log('Creating player ', players[i]);
		}
		return players;
	}
	function drawPlayer (playerObj) {
		// console.log('Drawing player: ' + playerObj.name);

		var playerTemplate = playerObj.template;
		if (typeof playerObj !== 'object') {
			return false;
		}
		// Draw player info
		playerTemplate.name.dataset.value = playerObj.name;
		playerTemplate.points.dataset.value = playerObj.points;
		playerTemplate.sets.dataset.value = playerObj.currentMatch.setsWon;
		playerTemplate.legs.dataset.value = playerObj.currentMatch.legsWon;
	}

	return {
		"control": {
			"create": createPlayers,
			"draw": drawPlayer
		},
		"template": template
	};
};
if (DARTS101.helpers.el('.player-info-container')) {
	DARTS101.playerInfo = DARTS101.playerInfo(DARTS101);
};
