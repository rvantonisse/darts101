/**
 * Grunt configuration for:
 * COPY
 */
function getConfiguration(grunt) {
	'use strict';
	return {
		development: {
			files: [
				// css images
				{
					expand:true,
					cwd: '<%= cssSourceDir %>images/',
					src: ['**/*'],
					dest: 'development/assets/images/'
				},
				// General media
				{
					expand:true,
					cwd: 'source/assets/media/',
					src: ['**/*'],
					dest: 'development/media/'
				},
				// Views and subviews media
				{
					expand:true,
					cwd: 'source/templates/views/',
					src: ['**/media/*', '**/**/media/*'],
					dest: 'development/'
				}
			]
		},
		distribution: {
			files: [
				{
					expand:true,
					cwd: '<%= cssSourceDir %>images/',
					src: ['**/*'],
					dest: 'distribution/assets/images/'
				},
				{
					expand:true,
					cwd: 'source/assets/media/',
					src: ['**/*'],
					dest: 'distribution/media/'
				},
				// Views and subviews media
				{
					expand:true,
					cwd: 'source/templates/views/',
					src: ['**/media/*', '**/**/media/*'],
					dest: 'distribution/'
				}
			]
		}
	};
}

module.exports = getConfiguration;