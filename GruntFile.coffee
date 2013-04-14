module.exports = (grunt) ->
  grunt.initConfig {
    pkg: grunt.file.readJSON('package.json')
    watch: {
      example: {
        files: ['dist/example.styl']
        tasks: ['stylus:example']
        options: {
          nospawn: true
        }
      }
      all: {
        files: ['lib/**/*.styl']
        tasks: ['build']
        options: {
          nospawn: true
        }
      }

    }
    stylus: {
      example: {
        options: {
          paths : ['dist']
          urlfunc: 'embedurl'
        }
        files: {
          'dist/example.css': 'dist/example.styl'
        }
      }
      lib: {
        options: {
          compress: false
          paths : ['dist']
          urlfunc: 'embedurl'
        }
        expand: true,
        cwd: 'lib/hstrap'
        src: ['**/!(mixins|values|forms-mixins).styl'],
        dest: 'dist/css',
        ext: '.css'
      }
    }
  }

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'

  grunt.registerTask 'help', ->
    grunt.log.writeln 'grunt build  :', 'Build css'

  grunt.registerTask 'clean', ->
    grunt.file.delete('dist/css') if grunt.file.exists('dist/css')

  grunt.registerTask 'build', ['clean', 'stylus:lib', 'stylus:example']
  grunt.registerTask 'default', ['help']
