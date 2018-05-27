var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Main_Category = require('./mainCategoryModel');


var subCategorySchema = new Schema({
  main_category:{
    type:Schema.Types.ObjectId,
    ref:'Main_Category',
    required:true
  },
 d_name:{
   type:String,
   required:true
 },
  name:{
    type:String,
    required:true
  }


})


var Sub_Category = mongoose.model('Sub_Category',subCategorySchema);
module.exports = Sub_Category;
