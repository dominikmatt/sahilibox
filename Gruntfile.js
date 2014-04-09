module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({
    
    compass: {
      dist: {
        options: {
          sassDir: 'examples/scss',
          cssDir: 'examples/css',
          outputStyle: 'compressed'
        }
      }
    },
    
    connect: {
        server: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            }
        }
    },
    
    watch: {
        files: ['examples/scss/*.scss'],
        tasks: ['compass']
    },
  });

  // Default task.
  grunt.registerTask('default', 'jshint');
  grunt.registerTask('server', ['connect:server', 'watch']);


};