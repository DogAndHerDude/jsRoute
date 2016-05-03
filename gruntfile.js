"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      build: {
        src: [".tmp", ".dist"]
      }
    },

    ts: {
      default: {
        options: {
          mapRoot: "./tmp/maps",
          module: "AMD",
          moduleResolution: "node"
        },
        src: ["./src/*.ts"],
        outDir: ".tmp"
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: '.tmp',
          name: "../node_modules/almond/almond",
          deps: ["index"],
          insertRequire: ["index"],
          findNestedDependencies: true,
          out: 'dist/jsRoute.js',
          wrap: true,
          optimize: 'none'
        }
      }
    },

    uglify: {
      target: {
        files: {
          "dist/jsRoute.min.js": ["dist/jsRoute.js"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-requirejs");

  grunt.registerTask("build", [
    "clean",
    "ts",
    "requirejs",
    "uglify"
  ]);

  grunt.registerTask("default", [
    "build"
  ])
};
