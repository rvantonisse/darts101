/*
** HTML-COMPILER
** Translate Nunjucks templating for this projects needs.
**/
// Use fs (FileSystem) to read files and dirs
var fs = require('fs');
// Include grunt 
var grunt = require('grunt');
var nunjucks = require('nunjucks');

(function(){
	'use strict';

	// Setup basic configuration
	function getSourceDir () {
		return 'source/';
	}
	function getAssetsDir () {
		return 'assets/';
	}
	function getTemplateDir () {
		return getSourceDir() + 'templates/';
	}
	function getViewsDir () {
		return getTemplateDir() + 'views/';
	}
	function getComponentsDir () {
		return getTemplateDir() + 'components/';
	}

	// Create a Nunjucks environment and load the views
	nunjucks.configure({
		lstripBlocks: false,
		trimBlocks: true
	});
	var env = new nunjucks.Environment(
		new nunjucks.FileSystemLoader(getTemplateDir())
	);

	// Setup compiler methods
	function getTemplate (name) {
		// grunt.log.writeln('Getting template for:', name);
		return env.getTemplate(name);
	}

	// Get all views in an array
	function getViews () {
		// grunt.log.writeln('Getting views:');
		// use fs to read the views folder; fs.readdirSync()
		var views = fs.readdirSync(getViewsDir())
			// filter to only select other dirs and not files
			.filter(function(name){
				return grunt.file.isDir(getViewsDir() + name);
			});
		// grunt.log.writeln('/********');
		// grunt.log.writeln(' * Views:');
		// views.forEach(function(name) {
		// 	grunt.log.writeln(' * - ' + name);
		// });
		// grunt.log.writeln('********/');
		// grunt.log.writeln('');
		return views;
	}
	function getViewData (view) {
		var dataPath = getViewsDir() + view + '/'  + view + '.json';
		var viewData = {};
		if (grunt.file.isFile(dataPath)) {
			viewData = grunt.file.readJSON(dataPath);
			grunt.log.writeln(view + ' with data: ' + dataPath);
		} else {
			grunt.log.writeln(view + ' without data.');
		}
		return viewData;
	}
	function getSubviewsFor (viewName) {
		var viewPath = getViewsDir() + viewName;
		var subviews = fs.readdirSync(viewPath)
			.filter(function (name) {
				return grunt.file.isDir(viewPath + '/' + name);
			})
			.filter(function (name) {
				return name !== 'media';
			});
		return subviews;
	}
	function getSubviewData (view, subview) {
		var dataPath = getViewsDir() + view + '/' + subview + '/' + subview + '.json';
		var subviewData = {};
		if (grunt.file.isFile(dataPath)) {
			subviewData = grunt.file.readJSON(dataPath);
			grunt.log.writeln(subview + ' with data: ' + dataPath);
		} else {
			grunt.log.writeln(subview + ' without data.');
		}
		return subviewData;
	}
	function getSubViews() {
		// grunt.log.writeln('Getting subviews');
		var views = getViews();
		var subViews = {};
		views.forEach(function(viewName){
			// grunt.log.writeln('viewName:', viewName);
			subViews[viewName] = fs.readdirSync(getViewsDir() + viewName)
			// filter to only select other dirs and not files
			.filter(function(name){
				// grunt.log.writeln(name + ' isDir? ' + grunt.file.isDir(getViewsDir() + viewName + '/' + name));
				return grunt.file.isDir(getViewsDir() + viewName + '/' + name);
			});
			// grunt.log.writeln('subViews[' + viewName + '](' + subViews[viewName].length + '):', subViews[viewName]);
			if (subViews[viewName].length === 0) {
				delete subViews[viewName];
			}
		});
		// grunt.log.writeln('/**');
		// grunt.log.writeln(' * There are subviews for:');
		// for (var key in subViews) {
		// 	if (key.length > 0) {
		// 		grunt.log.writeln(' * ' + key + ' (' + subViews[key].length + ')');
		// 		subViews[key].forEach(function(name) {
		// 			grunt.log.writeln(' * - ' + name);
		// 		}); 
		// 	}
		// }
		// grunt.log.writeln('**/');
		// grunt.log.ok('Got all subviews!');
		grunt.log.writeln('');
		return subViews;
	}



	// Export compiler as module
	module.exports = {
		getTemplate: getTemplate,
		getViews: getViews,
		getViewData: getViewData,
		getSubViews: getSubViews,
		getSubviewData: getSubviewData,
		getSubviewsFor: getSubviewsFor,
		getViewsDir: getViewsDir
	};

}());