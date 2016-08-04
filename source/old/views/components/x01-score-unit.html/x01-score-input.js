/*
* x01-score-input.js
* scoreInput
* Handles the score entering and submission with a nice display.
*/
var scoreInput = (function () {
	'use strict';

	var d = document;
	var scoreInput = d.forms.dartsScoreInput;
	var scoreInputValues = scoreInput.scoreInputValues;
	var scoreInputDisplay = scoreInput.scoreInputDisplay;

	// console.log(scoreInput);
	// console.log(scoreInputValues);
	// Add clickevent on score input values
	scoreInputValues.addEventListener("click", function (e) {
		// Get target clicked
		var target = e.target;
		var targetValue = target.innerText;
		// console.log(target.innerText);

		// add the number to the screen
		if(!addInputToOutput(targetValue)) {
			var btn = target;
			sendFeedbackWithButton(btn, false);
		} else {
			var btn = target;
			sendFeedbackWithButton(btn, true);
		}

	}, false);
	// Add an eventhandler on change for the display input
	scoreInputDisplay.addEventListener("input", function (e) {
		// console.log(e);
		if(!validateScore(e.target.value)) {
			sendFeedbackWithButton(e.target, false);
		} else {
			sendFeedbackWithButton(e.target, true);
		}
	}, false);

	function validateScore (score) {
		if(emptyScore()) {
			return false;
		}
		score = parseInt(score, 10);
		if(score < 0 || score > 180) {
			return false;
		}
		return true;
	}
	function addInputToOutput (input) {
		var result = '';
		var output = scoreInputDisplay.value;
		output = output.toString();
		input = input.toString();
		result = output + input;
		result = parseInt(result, 10);
		if(result > 180) {
			// Score cant exceed 180
			return false;
		}
		scoreInputDisplay.value = result;
		if(result === '' || result === '0') {
			scoreInputDisplay.value = '';
		}
		// console.log("Output", result);
		return true;
	}
	function sendFeedbackWithButton (btn, feedback) {
		var fbTrue = 'fb-true';
		var fbFalse = 'fb-false';
		var timer = 666;
		if(btn === null || feedback === null) {
			return false;
		}
		if(feedback) {
			addTempClass(btn, fbTrue, timer);
		} else {
			addTempClass(btn, fbFalse, timer);
		}
		return true;
	}
	function addTempClass (target, className, timer) {
		if(!timer || typeof timer !== 'number') {
			timer = 1000;
		}
		// Add a class
		addClass(target, className);

		// Remove a class after a delay
		setTimeout(function () {
			removeClass(target, className);
		}, timer);
	}
	function addClass (target, className) {
		if(typeof target === 'object' && typeof className === 'string') {
			target.classList.add(className);
			return true;
		}
		return false;
	}
	function removeClass (target, className) {
		if(typeof target === 'object' && typeof className === 'string') {
			target.classList.remove(className);
			return true;
		}
		return false;
	}
	function emptyScore () {
		if(scoreInputDisplay.value === '') {
			return true;
		}
		return false;
	}
	function getScore () {
		var score = scoreInputDisplay.value;
		if(emptyScore()) {
			return false;
		}
		score = parseInt(score, 10);
		if(validateScore(score)) {
			return score;
		}
		return false;
	}
	function submitScore() {
		if (!getScore()) {
			sendFeedbackWithButton(scoreInputDisplay, false);
		}
		return getScore(); 
	}
	function impossibleScores () {
		var nogoScores = [];
		var goscores = [];
		var nofinish = [];
		var doubles = [];
		var triples = [];
		var result;
		for (var x = 1; x <= 3; x++) {
			for (var y = 1; y <= 20; y++) {
				result = x * y;
				if (x == 2) {
					var aDouble = {};
					var aDoublekey = 'D' + y;
					aDouble[aDoublekey] = result;
					doubles.push(aDouble);
				}
				if (x == 3) {
					var aTriple = {};
					var aTriplekey = 'T' + y;
					aTriple[aTriplekey] = result;
					triples.push(aTriple);
				}
				if (goscores.indexOf(result) == -1) {
					goscores.push(result);
				}
			}
		}
		doubles.push({"B": 50});
		console.log("doubles:");
		for (var aDouble in doubles) {
			console.log(doubles[aDouble]);
		}
		console.log("Triples:");
		for (var aTriple in triples) {
			console.log(triples[aTriple]);
		}
		goscores.push(25, 50);
		goscores = goscores.sort(function (a,b) {
			return a - b;
		});
		console.log(goscores);
		for (var x = 1; x <= 60; x++) {
			if (goscores.indexOf(x) == -1) {
				nogoScores.push(x);
			}
		}
		console.log(nogoScores);
	}
	return {
		"info": "This is the score input handler. This is where you enter and submit your darts score.",
		"submitScore": submitScore,
		"noscore": impossibleScores
	};
})();

