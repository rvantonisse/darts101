/**
 * Grunt configuration for:
 * WATCH
 * Only used for development
 */
function getConfiguration(grunt) {
	'use strict';
	return {
		// Set options for Livereload etc..
		options: {
			livereload: true
		},
		// Watch all template .html files and run compile-html:development on changes
		templates: {
			files: [
				'<%= templatesSourceDir %>**/*.html',
				'!templatesSourceDir %>views/**/media/',
				'!templatesSourceDir %>views/**/**/media/'
			],
			tasks: ['compile-html:development']
		},
		// Watch all css and run css:development related tasks on changes
		css: {
			files: [
				'<%= cssSourceDir %>**/*.css',
				'<%= viewsSourceDir %>**/*.css',
				'<%= componentsSourceDir %>**/*.css'
			],
			tasks: ['concat:css']
		},
		// Watch all js files and run js:development related tasks on changes
		js: {
			files: [
				'<%= jsSourceDir %>**/*.js',
				'<%= viewsSourceDir %>**/*.js',
				'<%= componentsSourceDir %>**/*.js'
			],
			tasks: ['concat:js']
		}
	};
}

module.exports = getConfiguration;
