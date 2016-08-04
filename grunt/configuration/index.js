
/**
 * Load external grunt task configuration files by task name from given list.
 * @author Eric Bednarz
 * @param {Object} grunt
 * @param {Array} taskList
 */
function getConfiguration(grunt, taskList) {
    'use strict';
    var configuration = {
        pkg: grunt.file.readJSON('./package.json')
    };
    var length = taskList.length;
    var task;

    while (length--) {
        task = taskList[length];
        configuration[task] = require('./' + task)(grunt);
    }

    return configuration;
}

module.exports = getConfiguration;