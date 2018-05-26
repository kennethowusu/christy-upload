
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Description = require('./descriptionModel');
var Image = require('./imageModel');
var Variant = require('./variantModel');
var Variant_Image = require('./variantImageModel');

var ProductSchema = new Schema({

  name:{
    type:String
  },
  price:{
    type:Number
  },
  main_category:{
    type:String
  },
  category:{
    type:String
  },
  subcategory:{
    type:String
  },
  created:{
    type:Date,
    default:Date.now,
    required:true
  },
  color:{
    type:String
  },
  product_status:{
    type:String,
    enum:['on','off'],
    required:true,
    default:'off'
  },
  description:{
    type:Schema.Types.ObjectId,
    ref:"Description"
  },
  images:[{
    type:Schema.Types.ObjectId,
    ref:"Image"
  }],
  variants:[{
    type:Schema.Types.ObjectId,
    ref:"Variant"
  }]

});



var Product = mongoose.model('Product',ProductSchema);
module.exports = Product;
