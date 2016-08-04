var DARTS101 = DARTS101 || {};

DARTS101.feedback = (function (DARTS101) {

	'use strict';
	var help = DARTS101.helpers;

	function sendFeedbackWithButton (btn, feedback) {
		var fbClass = 'fb';
		var fbStates = {
			"true": {
				"fbClass": "fb-state-true"
			},
			"false": {
				"fbClass": "fb-state-false"
			},
			"default": {
				"fbClass": "fb-state-default"
			}
		};
		var timer = 333;
		feedback = feedback || 'default';
		if(btn === null) {
			return false;
		}
		// Send feedback
		help.addTemporaryClass(btn, fbClass, timer);
		help.addTemporaryClass(btn, fbStates[feedback].fbClass, timer);
		return true;
	}

	return {
		"sendFeedback": sendFeedbackWithButton
	};

})(DARTS101);