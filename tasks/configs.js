/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

module.exports = {
  'oraclejet-build': {
    supportedFlags: [
      'build-config',
      'destination',
      'device',
      'emulator',
      'platform',
      'sass',
      'theme',
      'themes',
      'no-sass',
      'platform-options'
    ],
    deprecations: [{
      flag: 'buildConfig',
      replacement: 'build-config',
      note: '2.1.0'
    }]
  },
  'oraclejet-serve': {
    supportedFlags: [
      'build',
      'build-config',
      'browser',
      'destination',
      'device',
      'emulator',
      'livereload-port',
      'livereload',
      'platform',
      'server-port',
      'server-only',
      'theme',
      'themes',
      'sass',
      'no-sass',
      'platform-options'
    ],
    deprecations: [{
      flag: 'buildConfig',
      replacement: 'build-config',
      note: '2.1.0'
    }, {
      flag: 'disableLiveReload',
      replacement: 'livereload',
      note: '2.1.0'
    }, {
      flag: 'livereloadPort',
      replacement: 'livereload-port',
      note: '2.1.0'
    }, {
      flag: 'serverPort',
      replacement: 'server-port',
      note: '2.1.0'
    }]
  },
  systemFlags: ['verbose', 'v', 'stack', 'd', 'debug', 'f', 'force', 'version', 'V', 'no-write', 'base', 'b', 'help', 'h', 'no-color', 'gruntfile', 'tasks', 'npm']
};
