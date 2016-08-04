module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'develop',
		'Setup development dir and watch source',
		function (mode) {

			var tasks = [
				'clean:development',
				'compile-html:development',
				'copy:development',
				// 'sass:development',
				'concat',
				'watch'
			];

			// if(mode !== 'no-watch'){
			// 	tasks.push('watch');
			// }

			grunt.task.run(tasks);
		}
	);
};
