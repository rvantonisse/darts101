var helpers = require('../utilities/helpers');
var fs = require('fs');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'create-view',
		'Create a new view',
		/**
		 * Create a new view inside source/templates/views/
		 * new-view/
		 * - media/
		 * -- index.html
		 * - new-view.css
		 * - new-view.html
		 * - new-view.js
		 * - new-view.json
		 * @param {String} viewName
		 */
		function (viewName) {
			var file = grunt.file;

			function getConfigViewName () {
				return grunt.config('createView.viewName') || null;
			}
			function getViewName () {
				return viewName || getConfigViewName();
			}

			function getViewUrl () {
				var niceUrl = helpers.replaceSpacesWithDashes;
				return niceUrl(getViewName());
			}
			function getDestination () {
				return 'source/templates/views/' + getViewUrl();
			}

			// Get new-view template
			function getTemplate (path) {
				return file.read(path).replace(/_VIEW-NAME_/g, getViewUrl());
			}
			function getTemplateFiles (path) {
				return fs.readdirSync(path)
					.filter(function (name) {
						return file.isFile(path + name);
					});
			}
			function writeFiles () {
				var newViewTemplatesDir = 'grunt/templates/new-view/';
				var files = getTemplateFiles(newViewTemplatesDir);
				
				// Create destinationdir
				file.mkdir(getDestination());
				file.mkdir(getDestination() + '/media');
				file.write(getDestination() + '/media/index.html', '');

				// Write files
				grunt.log.writeln('Writing files:');
				files.forEach(function (name) {
					var template = getTemplate(newViewTemplatesDir + name);
					name = name.replace('new-view', getViewUrl());
					grunt.log.ok(name);
					file.write(getDestination() + '/' + name, template);
				});
			}

			// No viewname
			if (getViewName() === '' || getViewName() === null) {
				// grunt.log.writeln('No viewname chosen');
				grunt.task.run([
					'prompt:create-view',
					'create-view'
				]);
				return true;
			}

			// View already exists: abort task
			if (file.isDir(getDestination())) {
				grunt.log.error('"' + getDestination() + '" already exists, task was aborted.');
				return true;
			}

			// All is good, write the new view
			writeFiles();

			// // Create new-view destination
			// file.mkdir(getDestination());

			// // Create media folder
			// file.mkdir(getDestination() + '/media');

			// Reset createView.viewName
			grunt.config('createView.viewName', null);
		}
	);
};
