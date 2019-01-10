/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

/**
 * # Dependencies
 */
const CORDOVA_CONFIG_XML = 'config.xml';
const SUPPORTED_PLATFORMS = ['web', 'ios', 'android', 'windows'];
const configs = require('./configs');
const path = require('path');
const fs = require('fs');
const ojetConfig = require('@oracle/oraclejet-tooling').config;

let grunt = {};
const utils = {};

/**
 * ## validateFlagSupport
 * Throw error if non-supported flag is passed in
 *
 * @private
 * @param {string} taskName - Grunt task name
 * @param {string} flag
 */
function validateFlagSupport(taskName, flag) {
  const supportedFlags = configs[taskName].supportedFlags;

  if (supportedFlags.indexOf(flag) === -1) {
    throw utils.toError(`Flag '${flag}' not supported!`);
  }
}

/**
 * ## validateFlag
 *
 * @private
 * @param {string} taskName - Grunt task name
 * @param {string} flag
 * @param {string} value
 */
function validateFlag(taskName, flag, value) {
  const deprecations = configs[taskName].deprecations;
  let validFlag = true;
  let valueArg = value;

  if (deprecations) {
    deprecations.forEach((deprecation) => {
      if (flag === deprecation.flag) {
        validFlag = false;

        // Cases with 'no-' prefix when value is 'undefined'
        if (!value) {
          valueArg = grunt.option(flag);
        }

        // Validate deprecated flag vs. valid flag
        if (grunt.option(deprecation.replacement) || grunt.option(`no-${deprecation.replacement}`)) {
          throw utils.toError(`Only one of '${flag}' and '${deprecation.replacement}' options allowed.`);
        }

        grunt.option(deprecation.replacement, valueArg);
        utils.log.warning(`Flag '${flag}' was deprecated. Please use '${deprecation.replacement}' instead. Flag was converted automatically.`);

        validateFlagSupport(taskName, deprecation.replacement);
      }
    });

    if (validFlag) {
      // Eventually strip 'no-' prefix
      if (flag.substring(0, 3) === 'no-') {
        validateFlagSupport(taskName, flag.substring(3));
      } else {
        validateFlagSupport(taskName, flag);
      }
    }
  }
}

/**
 * ## log
 *
 * @public
 * @param {string} message
 */
utils.log = (message) => {
  console.log(message);
};

/**
 * ## validateCommandFlags
 *
 * @public
 * @param {Object} gruntAsArg - Grunt object
 * @param {Object} flags      - Flags array
 */
utils.validateFlags = (gruntAsArg, flags) => {
  grunt = gruntAsArg;
  const taskName = grunt.task.current.name;

  if ({}.hasOwnProperty.call(configs, taskName)) {
    for (let i = 0; i < flags.length; i += 1) {
      const flagAndValueSplitted = flags[i].split('=');
      // also remove '--' prefix
      const flag = flagAndValueSplitted[0].substring(2);
      const value = flagAndValueSplitted[1];

      // Do not validate system flags
      if (configs.systemFlags.indexOf(flag) === -1) {
        validateFlag(taskName, flag, value);
      }
    }
  }
};

/**
 * ## log.warning
 *
 * @public
 * @param {string} message
 */
utils.log.warning = (message) => {
  console.log(`\x1b[33mWarning: ${message}\x1b[0m`);
};


utils.toError = message =>
  new Error(message || 'Unknown error');

function _getInstalledPlatforms(cordovaPath) {
  try {
    const platformsJSON = grunt.file.readJSON(path.join(cordovaPath, 'platforms', 'platforms.json'));
    const platforms = Object.keys(platformsJSON);
    return platforms.filter(value => value !== 'browser');
  } catch (error) {
    throw error;
  }
}


/**
 * ## getDefaultPlatform
 * if single platform, return that platform
 *
 * @public
 * @returns {string}
 */

utils.getDefaultPlatform = (gruntAsArg) => {
  grunt = gruntAsArg;
  const pathConfig = ojetConfig.getConfiguredPaths();
  const isHybrid = fs.existsSync(path.resolve(pathConfig.staging.hybrid, CORDOVA_CONFIG_XML));
  const isAddHybrid = fs.existsSync(path.resolve(pathConfig.src.web))
                      || fs.existsSync(path.resolve(pathConfig.src.hybrid));

  if (isHybrid) {
    const platforms = _getInstalledPlatforms(pathConfig.staging.hybrid);
    // if only one platform is installed, default to that one
    if (platforms.length === 1 && !isAddHybrid) {
      return platforms[0];
    }
    // if multiple platforms are installed, throw error
    const supportedPlatforms = SUPPORTED_PLATFORMS.toString().replace(/,/g, '||');
    throw utils.toError(`Missing platform. Please use "--platform=<${supportedPlatforms}>"`);
  }
  return 'web';
};

utils.validatePlatform = (platform, gruntAsArg) => {
  grunt = gruntAsArg;
  let validPlatform;
  if (!platform) {
    validPlatform = utils.getDefaultPlatform(gruntAsArg);
    utils.log.warning(`Missing platform. Default to ${validPlatform}.`);
    return validPlatform;
  }
  if (SUPPORTED_PLATFORMS.indexOf(platform) > -1) {
    return platform;
  }
  throw utils.toError(`Invalid platform: ${platform}.`);
};

utils.validateServeOptions = (serveOptions, targetKey, platform) => {
  let customOptions = {};

  if (serveOptions) {
    if (platform === 'web' && serveOptions.web[targetKey]) {
      customOptions = Object.assign({}, serveOptions[targetKey], serveOptions.web[targetKey]);
    } else if (platform === 'hybrid' && serveOptions.hybrid[targetKey]) {
      customOptions = Object.assign({}, serveOptions[targetKey], serveOptions.hybrid[targetKey]);
    } else if (serveOptions[targetKey]) {
      customOptions = Object.assign({}, serveOptions[targetKey]);
    }
  }
  return customOptions;
};

utils.validateThemes = (themeString) => {
  if (themeString) {
    return themeString.split(',');
  }
  return undefined;
};


utils.validatePlatformOptions = (platformOptions, platform) => {
  if (platformOptions && platform === 'web') {
    utils.log.warning(`--platform-options has no effect for platform: ${platform}.`);
    return '';
  }
  return platformOptions;
};


module.exports = utils;

