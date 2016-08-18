/**
  Copyright (c) 2015, 2016, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

/**
 * # Dependencies
 */
const CORDOVA_CONFIG_XML = "config.xml";
const CORDOVA_DIRECTORY = "hybrid";
const SUPPORTED_PLATFORMS = ['web', 'ios', 'android', 'windows'];
const configs = require('./configs');
const path = require('path');
const fs = require('fs');
let grunt = {};
let utils = {};

/**
 * ## validateFlagSupport
 * Throw error if non-supported flag is passed in
 *
 * @private
 * @param {string} taskName - Grunt task name
 * @param {string} flag
 */
function validateFlagSupport(taskName, flag)
{
  const supportedFlags = configs[taskName].supportedFlags;
  
  if (supportedFlags.indexOf(flag) === -1) 
  {
    utils.log.error('Flag \'' + flag +'\' not supported!');
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
function validateFlag(taskName, flag, value)
{
  const deprecations = configs[taskName].deprecations;
  let validFlag = true;
  
  if (deprecations)
  {
    for (let i = 0; i < deprecations.length; i++)
    {
      const deprecation = deprecations[i];
      if (flag === deprecation.flag)
      {
        validFlag = false;
        
        // Cases with 'no-' prefix when value is 'undefined'
        if (!value) 
        {
          value = grunt.option(flag) 
        }
        
        // Validate deprecated flag vs. valid flag 
        if (grunt.option(deprecation.replacement) || grunt.option('no-' + deprecation.replacement)) 
        {
          utils.log.error('Only one of \'' + flag + '\' and \'' + deprecation.replacement + '\' options should be specified.');
        }
        
        grunt.option(deprecation.replacement, value);  
        utils.log.warning('Flag \'' + flag + '\' was deprecated. Please use \'' + deprecation.replacement + '\' instead. Flag was converted automatically.');
        
        validateFlagSupport(taskName, deprecation.replacement);
      }
    }
    
    if (validFlag) {
      // Eventually strip 'no-' prefix
      if (flag.substring(0,3) === 'no-') {
        flag = flag.substring(3)
      }
      validateFlagSupport(taskName, flag);
    }
  }
}

/**
 * ## log
 *
 * @public
 * @param {string} message
 */
utils.log = (message) =>
{
  console.log(message);  
};

/**
 * ## validateCommandFlags
 *
 * @public
 * @param {Object} gruntAsArg - Grunt object 
 * @param {Object} flags      - Flags array
 */
utils.validateFlags = (gruntAsArg, flags) => 
{
  grunt = gruntAsArg;
  const taskName = grunt.task.current.name;
  
  if (configs.hasOwnProperty(taskName))
  {
    for (let i = 0; i < flags.length; i++) 
    {
      const flagAndValueSplitted = flags[i].split('=');
      // also remove '--' prefix
      const flag = flagAndValueSplitted[0].substring(2);
      let value = flagAndValueSplitted[1];

      // Do not validate system flags
      if (configs.systemFlags.indexOf(flag) === -1) 
      {
        validateFlag(taskName, flag, value);  
      }
    }
  }
};

/**
 * ## logModuleName
 *
 * @public
 */

utils.logModuleName = () => {
  console.log('\x1b[42m','Oracle JET Grunt plugin','\x1b[0m');
  utils.log('Processing Grunt command...');  
};

/**
 * ## log.success
 *
 * @public
 * @param {string} message
 */
utils.log.info = (message) =>
{
  console.log('\x1b[32m','[Info] ' +  message ,'\x1b[0m');
};

/**
 * ## log.warning
 *
 * @public
 * @param {string} message
 */
utils.log.warning = (message) =>
{
  console.log('\x1b[33m','[Warning] ' +  message ,'\x1b[0m');  
};

/**
 * ## log.error
 * Throws error
 *
 * @public
 * @param {string} [message] - Error message
 */
utils.log.error = (message) =>
{
  message = message || 'Unknown error';
  throw new Error(message);
};

function _getInstalledPlatforms() {
  try {
    const platformsJSON = grunt.file.readJSON(path.join(CORDOVA_DIRECTORY, 'platforms', 'platforms.json'));
    const platforms = Object.keys(platformsJSON);
    return platforms.filter((value) => value !== 'browser');
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
  const isHybrid = fs.existsSync(path.resolve(CORDOVA_DIRECTORY, CORDOVA_CONFIG_XML));
  if (isHybrid) {
    let platforms = _getInstalledPlatforms();
    // if only one platform is installed, default to that one
    if (platforms.length === 1) {
      return platforms[0];
    } else {
      // if multiple platforms are installed, throw error
      const supportedPlatforms = SUPPORTED_PLATFORMS.toString().replace(/,/g,'||');
      utils.log.error(`Missing platform. Please use \'--platform=\<${supportedPlatforms}\>\'`);
    }

  } else {
    return "web";
  }
};

utils.validatePlatform = (platform, gruntAsArg) => {
  grunt = gruntAsArg;
  let validPlatform;
  if (!platform) {
    validPlatform = utils.getDefaultPlatform(gruntAsArg);
    utils.log.warning(`Missing platform. Default to ${validPlatform}.`);
    return validPlatform;
  } else {
    if (SUPPORTED_PLATFORMS.indexOf(platform) > -1) {
      return platform;
    } else {
      utils.log.error(`Invalid platform: ${platform}.`);
    }
  }
};

utils.validateBuildOptions = (buildOptions, platform) => {
  const platformType = (platform === 'web') ? 'web': 'hybrid';  
  return (buildOptions && buildOptions[platformType]) ? buildOptions[platformType] : {};
}

utils.validateServeOptions = (serveOptions, targetKey) => {
  let config = {};
  if (serveOptions){    
    Object.keys(serveOptions).forEach(key => {
      if(key === targetKey) {
        config = serveOptions[key];
      }
     });
  }
  return config;
}

module.exports = utils; 

