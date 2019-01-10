/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

/**
 * # Dependencies
 */

const ojet = require('@oracle/oraclejet-tooling');
const utils = require('./utils');

/**
 * # Grunt Serve command
 * 'grunt serve ...'
 *
 * @public
 */

module.exports = (grunt) => {
  /**
   * # Private functions
   * ## _getDestinationShortcut
   * valuate flag for possible deprecation
   *
   * @private
   * @returns {string} destinationShortcut
   */
  function _getDestinationShortcut() {
    const destinationShortcuts = {
      browser: grunt.option('browser'),
      device: grunt.option('device'),
      emulator: grunt.option('emulator'),
      'server-only': grunt.option('server-only')
    };

    let size = 0;
    let shortcut = '';

    Object.keys(destinationShortcuts).forEach((key) => {
      if (destinationShortcuts[key]) {
        size += 1;
        shortcut = `${key}:${destinationShortcuts[key]}`;
      }
    });

    if (size > 1) {
      throw utils.toError('Only one of \'device/emulator/browser/server-only\' options should be specified');
    }

    return shortcut;
  }

  /**
   * ## _getValidDestination
   *
   * @private
   */
  function _validateDestination() {
    const destination = grunt.option('destination');
    const destinationShortcut = _getDestinationShortcut();

    if (destination && destinationShortcut) {
      throw utils.toError('Only one of \'destination/device/emulator/browser/server-only\' options should be specified');
    }

    if (destination || destinationShortcut) {
      grunt.option('destination', destination || destinationShortcut);
    }
  }

  /**
   * ## _validateLivereload
   * Temporary fix since we still support 'disableLiveReload' flag.
   * Such a value needs to be negated due to 'negative' name
   *
   * @private
   */
  function _validateLivereload() {
    if (grunt.option('disableLiveReload')) {
      grunt.option('livereload', false);
    }
  }


  /**
   * # Grunt serve command
   *
   * @public
   */
  grunt.registerTask('oraclejet-serve', 'Serves the oraclejet application.', function (buildType) {
    utils.validateFlags(grunt, grunt.option.flags());

    _validateDestination();
    _validateLivereload();

    const serveOptions = {};
    const platform = utils.validatePlatform(grunt.option('platform'), grunt);
    serveOptions.buildOptions = grunt.config('oraclejet-build') || {};
    serveOptions.buildType = buildType;
    serveOptions.buildConfig = grunt.option('build-config');
    serveOptions.build = grunt.option('build');
    serveOptions.destination = grunt.option('destination');
    serveOptions.livereload = grunt.option('livereload');
    serveOptions.livereloadPort = grunt.option('livereload-port');
    serveOptions.port = grunt.option('server-port');
    serveOptions.theme = grunt.option('theme');
    serveOptions.themes = utils.validateThemes(grunt.option('themes'));
    serveOptions.sassCompile = grunt.option('sass');
    serveOptions.platformOptions = utils.validatePlatformOptions(grunt.option('platform-options'), platform);
    serveOptions.connect = utils.validateServeOptions(grunt.config('oraclejet-serve'), 'connect', platform);
    serveOptions.watch = utils.validateServeOptions(grunt.config('oraclejet-serve'), 'watch', platform);
    if (buildType === 'release') {
      serveOptions.livereload = false;
    }

    const done = this.async();
    ojet.serve(platform, serveOptions)
      .then(() => {
        done();
      })
      .catch((error) => {
        // Can not throw in promise catch handler
        // http://stackoverflow.com/questions/30715367/why-can-i-not-throw-inside-a-promise-catch-handler
        setTimeout(() => {
          throw utils.toError(error);
        }, 0);
      });
  });
};
