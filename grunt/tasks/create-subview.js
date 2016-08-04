var helpers = require('../utilities/helpers');
var fs = require('fs');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'create-subview',
		'Create a new subview inside an existing view',
		/**
		 * Create a new subview inside source/templates/views/parentview/
		 * new-subview/
		 * - media/
		 * -- index.html
		 * - new-view.css
		 * - new-view.html
		 * - new-view.js
		 * @param {String} viewName
		 */
		function (viewName) {
			var file = grunt.file;
			var niceUrl = helpers.replaceSpacesWithDashes;
			var niceName = helpers.replaceDashesWithSpaces;

			function getSubviewName () {
				var configSubViewName = grunt.config('createSubview.viewName') || null;
				return viewName || configSubViewName;
			}
			function setConfigSubviewName (subviewName) {
				grunt.config('createSubview.viewName', subviewName);
				return true;
			}
			function getSubviewUrl () {
				return niceUrl(getSubviewName());
			}
			function isNotValidSubviewName () {
				var subviewName = getSubviewName();
				return (subviewName === '' || subviewName === null);
			}
			function isSubview () {
				return file.isDir(getDestination());
			}
			function getParentView () {
				var subViewParent = grunt.config('createSubview.parentView') || null;
				return subViewParent;
			}
			function getDestination() {
				return 'source/templates/views/' + getParentView() + '/' + getSubviewUrl();
			}

			// Get new-view template
			function getTemplate (path) {
				return file.read(path).replace(/_VIEW-NAME_/g, getSubviewUrl()).replace(/_PARENT-VIEW_/g, getParentView());
			}
			function getTemplateFiles (path) {
				return fs.readdirSync(path)
					.filter(function (name) {
						return file.isFile(path + name);
					});
			}
			function writeFiles () {
				var newViewTemplatesDir = 'grunt/templates/new-subview/';
				var files = getTemplateFiles(newViewTemplatesDir);
				
				// Create destinationdirs
				file.mkdir(getDestination());
				file.mkdir(getDestination() + '/media');
				file.write(getDestination() + '/media/index.html', '');

				// Write files
				grunt.log.writeln('Writing files:');
				files.forEach(function (name) {
					var template = getTemplate(newViewTemplatesDir + name);
					name = name.replace('new-subview', getSubviewUrl());
					grunt.log.ok(name);
					file.write(getDestination() + '/' + name, template);
				});
			}
			// grunt.log.writeln('viewName:' + viewName);
			// grunt.log.writeln('getSubviewName()' + getSubviewName());

			// If not a valid viewname, ask else continue
			if (isNotValidSubviewName()) {
				// grunt.log.writeln('"new-view" is the default name, pick another name.');
				grunt.task.run([
					'prompt:create-subview',
					'create-subview'
				]);
				return true;
			} else {
				setConfigSubviewName(getSubviewUrl());
			}

			/*
			** If there is not defined a parentview; is null:
			** 1) Ask to choose a parentview
			** 2) Run 'create-subview' again
			** else continue
			**/
			if (getParentView() === null) {
				// grunt.log.error('There was no parent view selected.');
				grunt.task.run([
					'prompt:create-subview-parentview',
					'create-subview'
				]);
				return true;
			}
			grunt.log.ok('parentView: ' + getParentView());

			// If subview already exists, abort
			if (isSubview()) {
				grunt.log.error('"' + getDestination() +  '" Already exists. Task aborted.');
				return true;
			}

			// All ok create the new subview
			grunt.log.ok('Creating new subview: "' + getDestination() + '"');
			writeFiles();


			// Reset createSubView.viewName
			grunt.config('createSubview.viewName', null);
		}
	);
};
