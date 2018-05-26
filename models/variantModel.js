
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./productsModel');
var Variant_Image = require('./variantImageModel');

var VariantSchema = new Schema({

product:{
   type: Schema.Types.ObjectId,
   ref: 'Product',
   required:true
  },

   color:{
   type:String,
  },

  variat_status:{
  type:String,
  enum:['on','off'],
  required:true,
  default:'off'
},
images:[{
  type:Schema.Types.ObjectId,
  ref:"Variant_Image"
}]


});



var Variant = mongoose.model('Variant',VariantSchema);
module.exports = Variant;
