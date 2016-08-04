/* game-settings.js */

var DARTS101 = DARTS101 || {};
DARTS101.gameSettings = function (DARTS101) {
	var help = DARTS101.helpers;
	var template = {
		"gameSettingsForm": document.forms['gameSettings'],
		"container": help.el('.game-settings'),
		"gameSettings": help.el('.game-settings').querySelectorAll('.game-setting'),
		"startButton": help.el('.game-settings button[type="submit"]')
	};
	var gameSettings = {};
	// var gameSettingsDefaults = {};


	function setGameSetting (setting, value) {
		gameSettings[setting] = value;
	}

	function setGameSettings () {
		var settingsForm = template.gameSettingsForm;
		var settingsObj = template.gameSettings;
		// console.log(settingsObj);
		for (var setting = 0; setting < settingsObj.length; setting++) {
			var thisSetting = settingsObj[setting];
			var name = thisSetting.id;
			var formObj = settingsForm.elements[name];
			var formValue = formObj.value;
			// console.log('Game setting ' + name + ': ' + formValue);
			setGameSetting(name, formValue);
		}
	}

	function getGameSetting (setting) {
		if (gameSettings[setting]) {
			return gameSettings[setting];
		}
		return false;
	}
	function getGameSettings () {
		// console.log('Game settings:');
		// console.log(gameSettings);
		return gameSettings;
	}
	function hideSettings () {
		// Remove the settings screen
		template.container.parentNode.classList.add('game-started');
	}
	function showSettings () {
		// Show the settings screen
		template.container.parentNode.classList.remove('game-started');
	}
	function setDefault () {
		// set player defaults for settings
	}
	function startGame () {
		setGameSettings();
		hideSettings();
	}
	function endGame () {
		showSettings();
	}

	template.gameSettingsForm.addEventListener('submit', function (e) {
		e.preventDefault();
	}, false);


	return {
		"template": {
			"startButton": template.startButton
		},
		"getGameSetting": getGameSetting,
		"getGameSettings": getGameSettings,
		"setGameSetting": setGameSetting,
		"startGame": startGame,
		"endGame": endGame
	};
};

// Only execute when needed to prevent errors and script blocking
if (DARTS101.helpers.el('.game-settings')) {
	DARTS101.gameSettings = DARTS101.gameSettings(DARTS101);
};
