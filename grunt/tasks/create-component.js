var helpers = require('../utilities/helpers');
var fs = require('fs');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'create-component',
		'Create a new component',
		/**
		 * Create a new component inside source/templates/components/
		 * new-component/
		 * - media/
		 * -- index.html
		 * - new-component.css
		 * - new-component.html
		 * - new-component.js
		 * - new-component.json
		 * @param {String} viewName
		 */
		function (componentName) {
			var file = grunt.file;

			function getConfigComponentName () {
				return grunt.config('createComponent.componentName') || null;
			}

			function getComponentName () {
				return componentName || getConfigComponentName();
			}

			function getComponentUrl () {
				var niceUrl = helpers.replaceSpacesWithDashes;
				return niceUrl(getComponentName());
			}
			function getDestination () {
				return 'source/templates/components/' + getComponentUrl();
			}

			// Get new-view template
			function getTemplate (path) {
				return file.read(path).replace(/_COMPONENT-NAME_/g, getComponentUrl());
			}
			function getTemplateFiles (path) {
				return fs.readdirSync(path)
					.filter(function (name) {
						return file.isFile(path + name);
					});
			}
			function writeFiles () {
				var newViewTemplatesDir = 'grunt/templates/new-component/';
				var files = getTemplateFiles(newViewTemplatesDir);
				
				// Create destinationdir
				file.mkdir(getDestination());

				// Write files
				grunt.log.writeln('Writing files:');
				files.forEach(function (name) {
					var template = getTemplate(newViewTemplatesDir + name);
					name = name.replace('new-component', getComponentUrl());
					grunt.log.ok(name);
					file.write(getDestination() + '/' + name, template);
				});
			}

			// No viewname
			if (getComponentName() === '' || getComponentName() === null) {
				// grunt.log.writeln('No componentname chosen');
				grunt.task.run([
					'prompt:create-component',
					'create-component'
				]);
				return true;
			}

			// View already exists: abort task
			if (file.isDir(getDestination())) {
				grunt.log.error('"' + getDestination() + '" already exists, task was aborted.');
				return true;
			}

			// All is good, write the new component
			writeFiles();

			// Reset createView.viewName
			grunt.config('createComponent.componentName', null);
		}
	);
};
