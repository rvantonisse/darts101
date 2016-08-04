module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'distribute',
		'Setup distribution dir and stuff it with goodies for the client',
		function (mode) {

			var tasks = [
				'clean:distribution',
				'compile-html:distribution',
				'copy:distribution',
				// 'sass:distribution',
				'concat:distribution',
				'cssmin',
				'uglify:distribution'
			];
			grunt.task.run(tasks);
		}
	);
};
