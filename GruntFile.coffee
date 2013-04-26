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
    copy: {
      font: {
        files: [
          {
            expand: true
            cwd: 'components/hiso-font/font/'
            src: '*'
            dest: 'dist/font'
            filter: 'isFile'
          }
        ]
      }
    }
  }

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.registerTask 'help', ->
    grunt.log.writeln 'grunt build:', 'Build css'

  grunt.registerTask 'clean', ->
    grunt.file.delete('dist/css') if grunt.file.exists('dist/css')
    grunt.file.delete('dist/font') if grunt.file.exists('dist/font')

  grunt.registerTask 'build', ['clean', 'stylus:lib', 'stylus:example', 'copy:font']
  grunt.registerTask 'default', ['help']
