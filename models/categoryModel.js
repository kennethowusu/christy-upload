var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sub_Category = require('./subCategoryModel');


var categorySchema = new Schema({
  sub_category:{
    type:Schema.Types.ObjectId,
    ref:'Sub_Category',
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


var Category = mongoose.model('Category',categorySchema);
module.exports = Category;
