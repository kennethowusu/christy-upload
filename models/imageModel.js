
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./productsModel');

var ImageSchema = new Schema({

 product:{
   type: Schema.Types.ObjectId,
    ref: 'Product',
    required:true
   },

  image:{
    type:String
  }


});



var Image = mongoose.model('Image',ImageSchema);
module.exports = Image;
