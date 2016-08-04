/**
 * Grunt configuration for:
 * CSSMIN
 * Only used for distribution
 */
function getConfiguration(grunt) {
	'use strict';
	return {
		all: {
			files: [
				// CSS files
				{
					src: [
						'<%= cssSourceDir %>vendor/**/*.css',
						'<%= cssSourceDir %>base/**/*.css',
						'<%= viewsSourceDir %>**/*.css',
						'<%= componentsSourceDir %>**/*.css'
					],
					dest: 'distribution/assets/<%= pkg.name %>.min.css'
				}
			]
		}
	};
}

module.exports = getConfiguration;