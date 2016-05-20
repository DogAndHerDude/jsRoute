'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        src: ['.tmp', 'dist', 'example/jsRoute.min.js']
      }
    },

    /*tsd: {
      refresh: {
        options: {
          command: 'reinstall',
          latest: true,
          options: {

          }
        }
      }
    },*/

    ts: {
      default: {
        options: {
          mapRoot: './tmp/maps',
          module: 'umd'
        },
        src: ['./src/**/*.ts'],
        outDir: '.tmp'
      }
    },

    requirejs: {
      AMDIncluded: {
        options: {
          baseUrl: '.tmp',
          name: '../node_modules/almond/almond',
          deps: ['index'],
          //insertRequire: ['index'],
          findNestedDependencies: true,
          out: 'dist/jsRoute.js',
          wrap: {
            start: '(function(global) {',
            end: 'global.JSRoute = global.JSRoute || require("index").Router; }(window));'
          },
          optimize: 'none'
        }
      },
      NoAMD: {
        options: {
          baseUrl: '.tmp',
          include: 'index',
          insertRequire: ['index'],
          findNestedDependencies: true,
          out: 'dist/jsRoute.noamd.js',
          wrap: true,
          optimize: 'none'
        }
      }
    },

    uglify: {
      target: {
        files: {
          'dist/jsRoute.min.js': ['dist/jsRoute.js'],
          'dist/jsRoute.noamd.min.js': ['dist/jsRoute.noamd.js']
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['jsRoute.min.js'],
            dest: 'example/'
          }
        ]
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          base: 'example',
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tsd');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('mergeAMD', ['requirejs:AMDIncluded', 'requirejs:NoAMD']);

  grunt.registerTask('build', [
    'clean',
    'ts',
    'mergeAMD',
    'uglify',
    'copy'
  ]);

  grunt.registerTask('serve', [
    'build',
    'connect'
  ]);

  grunt.registerTask('default', [
    'build'
  ])
};
