/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

/**
 * # Dependencies
 */

const fs = require('fs');
const path = require('path');

/**
 * # Grunt Help command
 * 'grunt help'
 *
 * @public
 */

module.exports = (grunt) => {
  grunt.registerTask('help', 'Displays help page for each of the build and serve tasks.', () => {
    const file = path.join(__dirname, '..', 'doc', 'help.txt');
    console.log(fs.readFileSync(file).toString('utf8'));
  });
};
