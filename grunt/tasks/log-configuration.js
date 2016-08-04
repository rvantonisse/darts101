module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'log-configuration',
		'Log the configuration',
		function (task) {
			// Get configuration
			var config = grunt.config.getRaw();
			if(task) {
				if (!config[task]) {
					grunt.log.error('No configuration for ' + task);
					return;
				}
				var taskConfig = config[task];
				showConfigTree(taskConfig);
			} else {
				showConfigTree(config);
			}
			function showConfigTree(obj) {
				if (typeof obj === 'object') {
					for (var thing in obj) {
						if (typeof obj[thing] === 'object') {
							logThis(thing, obj[thing]);
							showConfigTree(obj[thing]);
						} else {
							logThis(thing, obj[thing]);
						}
					}
					return true;
				}
				return false;
			}
			function logThis (thing, content) {
				grunt.log.writeln(thing + ': ' + content);
			}
		}
	);
};
