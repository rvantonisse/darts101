module.exports = function(grunt) {
  'use strict';

  // Load external configuration files by task name.
  var configuration = require('./grunt/configuration')(grunt, [
      'clean',
      'concat',
      'copy',
      'cssmin',
      // 'imagemin',
      // 'sass',
      // 'svgmin',
      'prompt',
      'uglify',
      'watch'
  ]);
  configuration.pkg = grunt.file.readJSON('package.json');
  configuration.templatesSourceDir = 'source/templates/';
  configuration.componentsSourceDir = '<%= templatesSourceDir %>components/';
  configuration.viewsSourceDir = '<%= templatesSourceDir %>views/';
  configuration.cssSourceDir = 'source/assets/css/';
  configuration.jsSourceDir = 'source/assets/js/';
  grunt.config.init(configuration);

  // Load all npm installed grunt tasks.
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /*
  Grunt task(s)
  */
  // Default task
  grunt.registerTask('default', ['develop']);

  // Load all tasks from the 'grunt/tasks'-folder
  grunt.task.loadTasks('grunt/tasks');

};