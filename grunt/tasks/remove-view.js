var fs = require('fs');
var helpers = require('../utilities/helpers');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'remove-view',
		'Remove a view',
		/**
		 * Remove a view and its contents
		 * viewname/
		 * - media/
		 * -- index.html
		 * - viewname.css
		 * - viewname.html
		 * - viewname.js
		 * @param {String} viewName
		 */
		function (viewName) {
			var file = grunt.file;

			function getConfigViewName () {
				return grunt.config('removeView.viewName') || null;
			}
			function getViewName () {
				return viewName || getConfigViewName();
			}

			// Set new-view destination
			function getViewDir () {
				var niceUrl = helpers.replaceSpacesWithDashes;
				return niceUrl(getViewName());
			}
			function getDestination () {
				return 'source/templates/views/' + getViewDir();
			}
			function isDir (path) {
				return file.isDir(path);
			}
			function isConfirmed () {
				return grunt.config('removeView.confirmed') || false;
			}
			function removeView() {
				file.delete(getDestination());
			}

			// If no view is chosen, ask with prompt then remove-view again
			if (getViewName() === null) {
				// grunt.log.error('There was no view selected.');
				grunt.task.run([
					'prompt:remove-view',
					'remove-view'
				]);
				return true;
			}

			// View does not exist
			if (!isDir(getDestination())) {
				grunt.log.error('"' + getViewDir() + '"-view does not exist, remove-view task was aborted.');
				return true;
			}

			// Is the removal confirmed?
			if (!isConfirmed()) {
				grunt.log.error('Removal was not confirmed, task aborted.');
				return true;
			}

			// All is ok remove the view
			removeView();
			grunt.log.ok('"' + getDestination() + '" was succesfully removed!');

			// Reset createView.viewName
			grunt.config('removeView.viewName', null);
			grunt.config('removeView.confirmed', false);
		}
	);
};
