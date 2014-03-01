module.exports = function(grunt) {

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
    
    watch: {
        files: ['examples/scss/*.scss'],
        tasks: ['compass']
    },
  });

  // Load JSHint task
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Default task.
  grunt.registerTask('default', 'jshint');


};