/*!
** Darts101
*/
var DARTS101 = DARTS101 || {};

/*
** Helpers
*/
DARTS101.helpers = (function (DARTS101) {
	'use strict';
	var d = document;

	// Queryselector tool
	function el (query) {
		if(d.querySelector(query)) {
			return d.querySelector(query);
		}
		return null;
	}
	function addTemporaryClass (target, className, timer) {
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
	return {
		"el": el,
		"addTemporaryClass": addTemporaryClass,
		"addClass": addClass,
		"removeClass": removeClass
	};

})(DARTS101);

DARTS101.feedback = (function (DARTS101) {
	var help = DARTS101.helpers;
	var template = {
		"msgBox": help.el('.msg-box')
	};


	function sendMessage (msgContent, msgType) {
		msgContent = msgContent.toString();
		msgType = msgType.toString();
	}

	return {
		"sendMessage": sendMessage
	};
})(DARTS101);