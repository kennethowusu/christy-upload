
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Variant = require('./variantModel');
var Product = require('./productsModel');
var Variant_Image = new Schema({

product:{
  type:Schema.Types.ObjectId,
  ref:'Product',
  required:true
},
 variant:{
    type: Schema.Types.ObjectId,
    ref: 'Variant',
    required:true
  },
  image:{
    type:'String',
    required:true
  }

});



var Variant_Image = mongoose.model('Variant_Image',Variant_Image);
module.exports = Variant_Image;
