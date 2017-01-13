/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
/*
 * grunt-oraclejet
 */
const ojet = require('oraclejet-tooling');
const utils = require('./utils');

module.exports = function (grunt) {
  grunt.registerTask('oraclejet-build', 'build oraclejet application', (target) => {
    utils.logModuleName();    
    utils.validateFlags(grunt, grunt.option.flags());

    const done = grunt.task.current.async();
    const platform = utils.validatePlatform(grunt.option('platform'), grunt);
    const options = utils.validateBuildOptions(grunt.config('oraclejet-build'), platform);
    const buildType = target || 'dev';
    options.buildType = buildType;
    options.buildConfig = grunt.option('build-config');
    options.theme = grunt.option('theme');
    options.themes = utils.validateThemes(grunt.option('themes'));
    options.sassCompile = grunt.option('sass');
    options.destination = _getDestination(grunt);
    options.platformOptions = utils.validatePlatformOptions(grunt.option('platform-options'), platform);
    ojet.build(platform, options)
    .then(() => {
      done();
    })
    .catch((error) => grunt.log.error(error));
  });
};

function _getDestination(grunt) {
  let destination;
  if (grunt.option('emulator')) {
    destination = 'emulator';   
  } else if (grunt.option('device')) {
    destination = 'device';
  } else {
    destination = grunt.option('destination');
  }
  return destination;
}
