/* message-box.js */
var DARTS101 = DARTS101 || {};
DARTS101.messageBox = function (DARTS101) {

	var help = DARTS101.helpers;
	var feedback = DARTS101.feedback;

	var template = {
		"container": help.el('.message-box'),
		"message": help.el('.message'),
		"messageButtons": help.el('.message-buttons')
	};
	var messageTypes = {
		"confirm": {
			"msgClass": "message-type-confirm"
		},
		"abort": {
			"msgClass": "message-type-abort"
		},
		"alert": {
			"msgClass": "message-type-alert"
		}
	};

	function showMessage (message, type) {
		var msgBox = template.container;
		var msg = template.message;
		if (type) {
			var msgClass = messageTypes[type].msgClass || false;
			if (!type in messageTypes) {
				return false;
			}
		}
		msgBox.classList.remove('hide-message');
		msgBox.classList.add('show-message');
		if (msgClass) {
			msgBox.classList.add(msgClass);
		}
		msg.dataset.message = message;

	}
	function hideMessage (msgClass) {
		var msgBox = template.container;
		if (msgBox.classList.contains(msgClass)) {
			msgBox.classList.remove(msgClass);
		}
		msgBox.classList.remove('show-message');
		msgBox.classList.add('hide-message');
	}
	template.messageButtons.addEventListener('click', function (e) {
		var target = e.target;
		if (target.tagName === 'BUTTON') {
			feedback.sendFeedback(target);
			switch (target.dataset.value) {
				case 'OK':
					hideMessage();
				break;

				case 'CANCEL':
					hideMessage();
				break;
			}
		}
	}, false);

	return {
		"showMessage": showMessage
	};

};

if (DARTS101.helpers.el('.message-box')) {
	DARTS101.messageBox = DARTS101.messageBox(DARTS101);
};