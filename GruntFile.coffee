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
          paths : ['lib/hstrap']
          urlfunc: 'embedurl'
        }
        files: {
          'dist/css/hstrap.css': 'lib/hstrap/index.styl'
          'dist/css/buttons.css': 'lib/hstrap/buttons.styl'
          'dist/css/forms.css': 'lib/hstrap/forms/index.styl'
          'dist/css/default-forms.css': 'lib/hstrap/forms/default.styl'
          'dist/css/layout.css': 'lib/hstrap/layout.styl'
          'dist/css/links.css': 'lib/hstrap/links.styl'
          'dist/css/reset.css': 'lib/hstrap/reset.styl'
          'dist/css/type.css': 'lib/hstrap/type.styl'
          'dist/css/components/box.css': 'lib/hstrap/components/box.styl'
          'dist/css/components/popover.css': 'lib/hstrap/components/popover.styl'
        }
      }
      pouic: {
        options: {
          compress: false
          paths : ['lib/hstrap']
          urlfunc: 'embedurl'
        }
        files: {
          'dist/reset.css': 'lib/hstrap/reset.styl'
        }
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
  grunt.registerTask 'lib', ['clean', 'stylus:lib']
  grunt.registerTask 'default', ['help']
