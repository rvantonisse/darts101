var fs = require('fs');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'remove-subview',
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
		function () {
			var file = grunt.file;

			// Methods
			function getDefaultViewName () {
				return 'subview';
			}



			function getParentView () {
				var subViewParent = grunt.config('removeSubview.parentView') || null;
				return subViewParent;
			}



			function getSubviews (parentView) {
				// grunt.log.writeln('Getting subviews for ' + parentView);
				var subviews = [];

				// Check if parentview really exists
				// Then read the dir and look for subdirs; subviews
				if (file.isDir(getDestinationDir())) {
					subviews = fs.readdirSync(getDestinationDir())
					.filter(function(name){
						// grunt.log.writeln(name + ' isDir? ' + grunt.file.isDir(getViewsDir() + viewName + '/' + name));
						return file.isDir(getDestinationDir() + '/' + name);
					});
				}
				return subviews;
			}



			function getSubviewName () {
				var subviewName = grunt.config('removeSubview.viewName') || null;
				return subviewName;
			}



			function getDestinationDir () {
				return 'source/templates/views/' + getParentView();
			}



			function getConfirm () {
				return grunt.config('removeSubview.confirmed') || false;
			}



			// Set new-view destination
			function getViewDir () {
				return getSubviewName();
			}
			function getDestination () {
				return getDestinationDir() + '/' + getViewDir();
			}
			function isDir (path) {
				return file.isDir(path);
			}
			function isConfirmed () {
				return getConfirm();
			}
			function removeView() {
				file.delete(getDestination());
			}

			/*
			** If there is not defined a parentview; is DefaultViewName or is null:
			** 1) Ask to choose a view
			** 2) Run 'remove-subview again'
			** else continue
			**/
			if (getParentView() === null) {
				// grunt.log.error('There was no parent view selected.');
				grunt.task.run([
					'prompt:remove-subview-1',
					'remove-subview'
				]);
				return true;
			}
			grunt.log.ok('parentView: ' + getParentView());

			/*
			** If parentView has no subviews:
			** 1) Abort remove-subview task
			** Else continue
			**/
			if (getSubviews(getParentView()).length === 0) {
				grunt.log.error(getParentView() + ' contains no subviews to remove! Task aborted.');
				return true;
			}
			// grunt.log.ok(getParentView() + ' contains subviews.');

			/*
			** If the subview to remove is not defined; is DefaultSubviewName or is null
			** 1) Ask to choose a subview
			** 2) Run 'remove-subview'
			** Else Continue
			**/
			if (getSubviewName() === null) {
				// grunt.log.error('There was no subview selected.');
				grunt.config('removeSubview.parentView', getParentView());
				grunt.task.run([
					'prompt:remove-subview-2',
					'remove-subview'
				]);
				return true;
			}
			grunt.log.ok('Subview: ' + getSubviewName());

			// If remove is not confirmed, abort the task
			if (!isConfirmed()) {
				grunt.log.error('Subview removal was not confirmed, task aborted.');
				return true;
			}
			grunt.log.ok('Confirmed: ' + isConfirmed());

			// If target subview does not exists, abort
			if (!isDir(getDestination())) {
				grunt.log.error('"' + getDestination() + '" does not exist! Task aborted.');
				return true;
			}

			// All is good, remove the subview
			removeView();
			grunt.log.ok('"' + getDestination() + '" was succesfully removed!');


			// Reset configs
			grunt.config('removeSubview.viewName', null);
			grunt.config('removeSubview.confirmed', false);
		}
	);
};
