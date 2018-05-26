
module.exports = function(grunt){

  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),

  //sass task
  sass: {
    dist: {
      options: {
        style: 'expanded'
      },
      files: {

        'public/stylesheets/style.css':'scss/upload.scss'
        //'widgets.css': 'widgets.scss'
      }
    }
  },

  //autoprefixer task
  autoprefixer:{
    options:{
        // We need to `freeze` browsers versions for testing purposes.
        browsers: ['opera 12', 'ff 15', 'chrome 25']
    },

     main_css: {
      src: 'css/style.css',
      dest: 'css/style.css'
    }
  },



  //watch tasks
  watch: {
    options:{
      livereload:false
    },
    scss: {
      files: ['scss/*.scss'],
      tasks: ['sass','autoprefixer']
    },

  }
});

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-contrib-watch');



grunt.registerTask('default', ['watch']);

}
