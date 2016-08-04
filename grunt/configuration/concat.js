/**
 * Grunt configuration for:
 * CONCAT
 */
function getConfiguration(grunt) {
	'use strict';
	return {
		css: {
			files: [
				// CSS files
				{
					src: [
						'<%= cssSourceDir %>vendor/**/*.css',
						'<%= cssSourceDir %>base/**/*.css',
						'<%= viewsSourceDir %>**/*.css',
						'<%= componentsSourceDir %>**/*.css'
					],
					dest: 'development/assets/<%= pkg.name %>.css'
				}
			]
		},
		js: {
			files: [
				// JS files
				{
					src: [
						'<%= jsSourceDir %>vendor/**/*.js',
						'<%= jsSourceDir %>base/**/*.js',
						'<%= componentsSourceDir %>**/*.js',
						'<%= viewsSourceDir %>**/*.js'
					],
					dest: 'development/assets/<%= pkg.name %>.js'
				}
			]
		},
		distribution: {
			files: [
				// CSS files
				{
					src: [
						'<%= cssSourceDir %>vendor/**/*.css',
						'<%= cssSourceDir %>base/**/*.css',
						'<%= viewsSourceDir %>**/*.css',
						'<%= componentsSourceDir %>**/*.css'
					],
					dest: 'distribution/assets/<%= pkg.name %>.css'
				},
				// JS files
				{
					src: [
						'<%= jsSourceDir %>vendor/**/*.js',
						'<%= jsSourceDir %>base/**/*.js',
						'<%= componentsSourceDir %>**/*.js',
						'<%= viewsSourceDir %>**/*.js'
					],
					dest: 'distribution/assets/<%= pkg.name %>.js'
				}
			]
		}
	};
}

module.exports = getConfiguration;