/*
* score-input.js
* scoreInput
* Handles the score entering and submission with a nice display.
* Takes care for validation of inputted score.
*/
var DARTS101 = DARTS101 || {};
DARTS101.scoreInput = function (DARTS101) {
	'use strict';
	var help = DARTS101.helpers;
	var feedback = DARTS101.feedback;
	var template = {
		"container": help.el('.score-input-container'),
		"display": help.el('.score-input-display'),
		"inputButtons": help.el('.score-input-buttons'),
		"clearButton": help.el('.score-input-buttons [type="reset"]'),
		"submitButton": help.el('.score-input-buttons [type="submit"]')
	};

	// console.log(scoreInput);
	// console.log(scoreInputValues);
	// Add clickevent on score input values
	template.inputButtons.addEventListener("click", function (e) {
		// Get target clicked
		var target = e.target;
		var targetValue = target.dataset.value;
		// console.log('Click fired!');
		// console.log(e);
		// console.log('You pressed: ' + targetValue);
		// console.log(target.type);
		if (target.type === 'button') {
			// add the number to the screen
			if(!writeToOutput(targetValue)) {
				feedback.sendFeedback(target, 'false');
			} else {
				feedback.sendFeedback(target, 'true');
			}
		}

	}, false);

	// Add click listener to clearButton
	template.clearButton.addEventListener('click', function (e) {
		clearInput();
	}, false);

	// Create a library for all (im)possible scores, finishes
	// Doubles and Triples
	function createScoreLibrary () {
		var nogoScores = [];
		var goscores = [];
		var nofinish = [];
		var singles = [];
		var doubles = [];
		var triples = [];
		var finishes1Dart = [];
		var finishes2Darts = [];
		var finishes3Darts = [];
		var scores1Dart = [];
		var scores2Darts = [];
		var scores3Darts = [];
		var allScores = [];

		// Create a list of single dart scores, Doubles and Triples
		for (var x = 1; x <= 3; x++) {
			for (var y = 1; y <= 20; y++) {
				var result = x * y;
				// Create single list
				if (x == 1) {
					var aSingle = {};
					var aSinglekey = 'S' + y;
					aSingle[aSinglekey] = result;
					singles.push(aSingle);
				}
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
		// Add bull to singles
		singles.push({"SB": 25});
		// Add bullseye to doubles
		doubles.push({"B": 50});

		// Log Doubles
		// console.log("doubles:", doubles);

		// Log triples
		// console.log("Triples:", triples);

		// All possible 1 dart scores
		// Add bull specific points
		goscores.push(25, 50);
		goscores = goscores.sort(function (a,b) {
			return a - b;
		});
		scores1Dart = goscores;
		// console.log('Possible scores');
		// console.log(goscores);

		// Not possible single dart scores
		for (var x = 1; x <= 60; x++) {
			if (goscores.indexOf(x) === -1) {
				nogoScores.push(x);
			}
		}
		// console.log('Not possible scores');
		// console.log(nogoScores);

		// Ceate score possibillities
		for (var x in goscores) {
			var score = goscores[x];
			if (allScores.indexOf(score) === -1) {
				allScores.push(score);
			}
			for (var y in goscores) {
				var score = goscores[x] + goscores[y];
				// 2 darts scores
				if (allScores.indexOf(score) === -1) {
					allScores.push(score);
				}
				if (scores2Darts.indexOf(score) === -1) {
					scores2Darts.push(score);
				}

				for (var z in goscores) {
				var score = goscores[x] + goscores[y] + goscores[z];
					// 3 darts scores
					if (allScores.indexOf(score) === -1) {
						allScores.push(score);
					}
					if (scores3Darts.indexOf(score) === -1) {
						scores3Darts.push(score);
					}

				}
			}
		}
		// Log all scores 1 - 3 darts
		allScores = allScores.sort(function (a,b) {
			return a - b;
		});
		// console.log('All possible scores:', allScores);

		// Log scores for 2 darts
		scores2Darts = scores2Darts.sort(function (a,b) {
			return a - b;
		});
		// console.log('2 darts scores:', scores2Darts);


		// Log scores for 3 darts
		scores3Darts = scores3Darts.sort(function (a,b) {
			return a - b;
		});
		// console.log('3 darts scores:', scores3Darts);

		// Create finishing scores
		for (var x in doubles) {
			// console.log('Finishing scores with ', doubles[x]);
			for (var y in goscores) {
				var aDouble = doubles[x];
				for (var d in aDouble) {
					// 2 dart finish
					var finish = parseInt(aDouble[d], 10) + goscores[y];
					if (finishes2Darts.indexOf(finish) === -1) {
						finishes2Darts.push(finish);
					}
					// console.log(x + ': ' + aDouble[z]);
				}
				for (var z in goscores) {
					var aDouble = doubles[x];
					for (var d in aDouble) {
						// 3 dart finish
						var finish = parseInt(aDouble[d], 10) + goscores[y] + goscores[z];
						if (finishes3Darts.indexOf(finish) === -1 && finish > 98) {
							finishes3Darts.push(finish);
						}
						// console.log(x + ': ' + aDouble[z]);
					}
				}

				// console.log(y + ':', goscores[y]);
			}
		}
		// Log 2 darts finish
		finishes2Darts = finishes2Darts.sort(function (a,b) {
			return a - b;
		});
		// console.log('2 darts finish', finishes2Darts);



		// Log 3 darts finish
		finishes3Darts = finishes3Darts.sort(function (a,b) {
			return a - b;
		});
		// console.log('3 darts finish', finishes3Darts);
		return {
			"doubles": doubles,
			"triples": triples,
			"finishes1Dart": finishes1Dart,
			"finishes2Darts": finishes2Darts,
			"finishes3Darts": finishes3Darts,
			"scores1Dart": scores1Dart,
			"scores2Darts": scores2Darts,
			"scores3Darts": scores3Darts,
			"allScores": allScores
		};
	}


	function writeToOutput (input) {
		var result = '';
		var output = template.display.dataset.value;
		output = output.toString();
		input = input.toString();
		result = output + input;
		result = parseInt(result, 10);
		// Score cant exceed 180
		if(!validateScore(result)) {
			return false;
		}
		template.display.dataset.value = result;
		// console.log("Output", result);
		return true;
	}

	// Clear the inputted score
	function clearInput () {
		// console.log('Clearing input.');
		template.display.dataset.value = '';
	}

	function validateScore (score) {
		score = parseInt(score, 10);
		if(score < 0 || score > 180) {
			return false;
		}
		return true;
	}

	function emptyScore () {
		if(template.display.dataset.value === '') {
			return true;
		}
		return false;
	}
	function getScore () {
		var score = template.display.dataset.value;
		if(emptyScore()) {
			return false;
		}
		score = parseInt(score, 10);
		if(typeof score === 'number') {
			return score;
		}
		return false;
	}
	function submitScore() {
		var score = getScore();
		if (!validateScore(score) || emptyScore()) {
			feedback.sendFeedback(template.display, 'false');
			clearInput();
			return false;
		} else {
			feedback.sendFeedback(template.display, 'true');
			// console.log('Submitting score: ', score);
			clearInput();
			return score; 
		}
	}



	// Return submit and clear
	return {
		"createScoreLibrary": createScoreLibrary,
		"submitScore": submitScore,
		"template": template,
		"clearScore": clearInput
	};
};
// Only execute when needed to prevent errors and script blocking
if (DARTS101.helpers.el('.score-input-container')) {
	DARTS101.scoreInput = DARTS101.scoreInput(DARTS101);
};

