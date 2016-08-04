/**
 * Grunt configuration for:
 * CLEAN
 */
function getConfiguration(grunt) {
	'use strict';
	return {
		development: [
			'development/*'
		],
		distribution: [
			'distribution/*'
		]
	};
}

module.exports = getConfiguration;