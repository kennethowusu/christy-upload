var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var mainCategorySchema = new Schema({

  d_name:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }


})


var Main_Category = mongoose.model('Main_Category',mainCategorySchema);
module.exports = Main_Category;
