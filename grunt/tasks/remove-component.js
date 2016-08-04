var fs = require('fs');
var helpers = require('../utilities/helpers');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'remove-component',
		'Remove a component',
		/**
		 * Remove a component and its contents
		 * componentname/
		 * - componentname.css
		 * - componentname.html
		 * - componentname.js
		 * @param {String} componentName
		 */
		function (componentName) {
			var file = grunt.file;

			function getConfigComponentName () {
				return grunt.config('removeComponent.componentName') || null;
			}
			function getComponentName () {
				return componentName || getConfigComponentName();
			}

			// Set new-view destination
			function getComponentDir () {
				var niceUrl = helpers.replaceSpacesWithDashes;
				return niceUrl(getComponentName());
			}
			function getDestination () {
				return 'source/templates/components/' + getComponentDir();
			}
			function isDir (path) {
				return file.isDir(path);
			}
			function isConfirmed () {
				return grunt.config('removeComponent.confirmed') || false;
			}
			function removeComponent() {
				file.delete(getDestination());
			}

			// If no component is chosen, ask with prompt then remove-view again
			if (getComponentName() === null) {
				// grunt.log.error('There was no component selected.');
				grunt.task.run([
					'prompt:remove-component',
					'remove-component'
				]);
				return true;
			}

			// Component does not exist
			if (!isDir(getDestination())) {
				grunt.log.error('"' + getDestination() + '" does not exist, task was aborted.');
				return true;
			}

			// Is the removal confirmed?
			if (!isConfirmed()) {
				grunt.log.error('Removal was not confirmed, task aborted.');
				return true;
			}

			// All is ok remove the view
			removeComponent();
			grunt.log.ok('"' + getDestination() + '" was succesfully removed!');

			// Reset removeComponent
			grunt.config('removeComponent.componentName', null);
			grunt.config('removeComponent.confirmed', false);
		}
	);
};
