var grunt = require('grunt');

module.exports = (function(){

	// String helpers
	function niceUrl (string) {
		string = replaceSpacesWithDashes(string);
		return string.replace(/[_.\/]/g, '-');
	}
	function replaceSpacesWithDashes (string) {
		return string.replace(/ /g, '-');
	}
	function replaceDashesWithSpaces (string) {
		return string.replace(/-/g, ' ');
	}
	function replaceChar (string, target, changeTo) {
		var regex = new RegExp(target, 'g');
		string = string || null;
		changeTo = changeTo || '';

		if (typeof string !== 'string') {
			// grunt.log.error(string + ' is not a string.');
			return false;
		}
		if (string.indexOf(target) === -1) {
			// grunt.log.ok('No occurence of "' + target + '" was found. Returning: ' + string);
			return string;
		}
		// grunt.log.writeln('ReplaceChar: "' + target + '" in: "' + string + '" to: "' + changeTo + '"');
		// grunt.log.ok('Returning: ' + string.replace(regex, changeTo));
		return string.replace(regex, changeTo);
	}
	function capitalize (string) {
		string = string || null;
		if (typeof string !== 'string') {
			// grunt.log.error(string + ' is not a string.');
			return false;
		}
		return string.charAt(0).toUpperCase() + string.substr(1);
	}
	return {
		capitalize: capitalize,
		replaceChar: replaceChar,
		replaceSpacesWithDashes: replaceSpacesWithDashes,
		replaceDashesWithSpaces: replaceDashesWithSpaces
	};
})();