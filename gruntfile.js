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
          mapRoot: "./tmp/maps"
        },
        src: ["./src/*.ts"],
        outDir: ".tmp"
      }
    },

    uglify: {
      target: {
        files: {
          "dist/jsRoute.min.js": [".tmp/*.js", "!.baseDir.js"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("build", [
    "clean",
    "ts",
    "uglify"
  ]);

  grunt.registerTask("default", [
    "build"
  ])
};
