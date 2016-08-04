var fs = require('fs');

/**
 * Grunt configuration for:
 * PROMPT
 * Used for project tasks
 */
function getConfiguration(grunt) {
	'use strict';

	var file = grunt.file;

	var componentsDir = 'source/templates/components';
	var componentslist = fs.readdirSync(componentsDir)
		.filter(function(name){
			return file.isDir(componentsDir + '/' + name);
		});
		
	var viewsDir = 'source/templates/views';
	var viewslist = fs.readdirSync(viewsDir)
		.filter(function(name){
			// grunt.log.writeln(name + ' isDir? ' + grunt.file.isDir(getViewsDir() + viewName + '/' + name));
			return file.isDir(viewsDir + '/' + name);
		})
		.filter(function(name){
			return (name !== 'home');
		});

	var subviewsList = getSubviews() || [];
	function getSubviews () {
		var parentView = grunt.config('removeSubview.parentView') || null;
		var subviews = [];
		function getDestinationDir() {
			return viewsDir + '/' + parentView;
		}

		if (parentView !== null) {
			subviews = fs.readdirSync(getDestinationDir())
			.filter(function(name){
				// grunt.log.writeln(name + ' isDir? ' + grunt.file.isDir(getViewsDir() + viewName + '/' + name));
				return file.isDir(getDestinationDir() + '/' + name);
			});
		}
		subviewsList = subviews;
		return subviews;
	}

	return {
		"create-component": {
			options: {
				questions: [
					{
						config: 'createComponent.componentName',
						type: 'input',
						message: 'Enter a componentname'
					}
				]
			}
		},
		"create-subview": {
			options: {
				questions: [
					{
						config: 'createSubview.viewName',
						type: 'input',
						message: 'Enter a viewname:'
					}
				],
				then: function () {
					grunt.task.run('prompt:create-subview-parentview');
				}
			}
		},
		"create-subview-parentview": {
			options: {
				questions: [
					{
						config: 'createSubview.parentView',
						type: 'list',
						message: 'Choose a view to add the subview inside:',
						choices: viewslist
					}
				]
			}
		},
		"create-view": {
			options: {
				questions: [
					{
						config: 'createView.viewName',
						type: 'input',
						message: 'Enter a viewname'
					}
				]
			}
		},
		"remove-component": {
			options: {
				questions: [
					{
						config: 'removeComponent.componentName',
						type: 'list',
						message: 'Choose a component to remove',
						choices: componentslist
					},
					{
						config: 'removeComponent.confirmed',
						type: 'confirm',
						message: 'Remove this component and all of its contents?'
					}
				]
			}
		},
		"remove-subview-1": {
			options: {
				questions: [
					{
						config: 'removeSubview.parentView',
						type: 'list',
						message: 'Choose a view to remove the subview from',
						choices: viewslist
					}
				],
				then: function (results) {
					getSubviews();
					grunt.task.run('prompt:remove-subview-2');
				}
			}
		},
		"remove-subview-2": {
			options: {
				questions: [
					{
						config: 'removeSubview.viewName',
						type: 'list',
						message: 'Choose a subview to remove',
						choices: getSubviews
					},
					{
						config: 'removeSubview.confirmed',
						type: 'confirm',
						message: 'Remove this subview and all of its contents?'
					}
				]
			}
		},
		"remove-view": {
			options: {
				questions: [
					{
						config: 'removeView.viewName',
						type: 'list',
						message: 'Choose a view to remove',
						choices: viewslist
					},
					{
						config: 'removeView.confirmed',
						type: 'confirm',
						message: 'Remove this view and all of its contents?'
					}
				]
			}
		}
	};
}

module.exports = getConfiguration;