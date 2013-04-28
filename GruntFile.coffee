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
      options: {
        compress: false
        paths : ['lib/hstrap']
        urlfunc: 'embedurl'
      }
      example: {
        options: {
          paths : ['dist']
        }
        files: {
          'dist/example.css': 'dist/example.styl'
        }
      }
      scrollbox: {
        files: {
          'dist/css/components/scrollbox.css': 'lib/hstrap/components/scrollbox.styl'
        }
      }
      lib: {
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
          'dist/css/components/scrollbox.css': 'lib/hstrap/components/scrollbox.styl'
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

  grunt.registerTask 'clean-font', ->
    grunt.file.delete('dist/font') if grunt.file.exists('dist/font')

  grunt.registerTask 'clean-css', ->
    grunt.file.delete('dist/css') if grunt.file.exists('dist/css')

  grunt.registerTask 'lib', ['clean-css', 'stylus:lib']
  grunt.registerTask 'font', ['clean-font','copy:font']
  grunt.registerTask 'build', ['lib', 'stylus:example', 'font']
  grunt.registerTask 'default', ['help']
