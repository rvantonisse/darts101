/* game-info.js */
var DARTS101 = DARTS101 || {};
DARTS101.gameInfo = (function (DARTS101) {

	var help = DARTS101.helpers || {};

	// Create the template
	var template = {
		"gameVersion": help.el('.game-info-version'),
		"gameSets": help.el('[data-gameinfo="sets"]'),
		"gameLegs": help.el('[data-gameinfo="legs"]'),
		"gameTurn": help.el('[data-gameinfo="turn"]')
	};

	// A game constructor
	function Game (meta, settings) {
		this.meta = meta;
		this.settings = settings;
		this.state = {
			bestOf: false,
			hasStarted: false,
			hasPlayers: true,
			currentMatch: 1,
			currentSet: 1,
			currentLeg: 1,
			currentTurn: 1,
			isScoring: false,
			startingPlayer: 1
		};

	}
	function createGame (meta, settings) {
		return new Game(meta, settings);
	}
	

	return {
		"createGame": createGame,
		"template": template
	};
})(DARTS101);