# grunt-oraclejet 2.3.0

## About the module
This module contains build and serve tasks for Oracle JET web and hybrid mobile applications.

This is an open source project maintained by Oracle Corp.

## Installation
The grunt-oraclejet module will be automatically installed if you scaffold a web or hybrid mobile app following the [Oracle JET Developers Guide](http://docs.oracle.com/middleware/jet230/jet/).

### Manual installation
This plugin requires Grunt `~1.0.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-oraclejet --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-oraclejet');
```

## Usage

### Overview
In your project's Gruntfile, add a section named `oraclejet` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  oraclejet: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  oraclejet: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  oraclejet: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## [Contributing](https://github.com/oracle/grunt-oraclejet/tree/master/CONTRIBUTING.md)
Oracle JET is an open source project.  Pull Requests are currently not being accepted. See 
[CONTRIBUTING](https://github.com/oracle/grunt-oraclejet/tree/master/CONTRIBUTING.md)
for details.

## [License](https://github.com/oracle/grunt-oraclejet/tree/master/LICENSE.md)
Copyright (c) 2014, 2017 Oracle and/or its affiliates
The Universal Permissive License (UPL), Version 1.0