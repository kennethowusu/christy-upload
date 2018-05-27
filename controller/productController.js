var express = require('express');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var util = require('util');
var async = require('async');
var Product = require('../models/productsModel');
var Description = require('../models/descriptionModel');
var Image = require('../models/imageModel');
var Variant = require('../models/variantModel');
var Variant_Image = require('../models/variantImageModel');
var Main_Category = require('../models/mainCategoryModel');
var router = express.Router();

//MODIFY FIELD FUNCTION
  module.exports.modifyField = function(fieldname,product_id,field_to_update,data_to_set){
  var query = {};

  query[fieldname] = product_id;
  var update = {};
  update[field_to_update] = data_to_set;
  Description.update(query,{$set:update},function(err,data){
    if(err){console.log(err)}
    return data;
  })

}

//FOR S3 IMAGE UPLOAD

///////////////////////////////////////////////////////////

//get products
module.exports.getProducts  = function(req,res,next){
          // res.render("newProduct");
    async.parallel({
      count_products:function(callback){
        Product.find().count().exec(callback);
      },
      products:function(callback){
         Product.find().populate('images').populate({
           path:'variants',
           model:"Variant",
           populate:{
             path:'images',
             model:"Variant_Image"
           }
         }).populate('description').exec(callback);
      },

    },function(err,results){
      if(err){return next(err);}
      console.log(util.inspect(results.products, false, null));
      // console.log(results.images);
      res.render('products',{count:results.count_products,products:results.products,title: 'Upload new products | Glammycare'})
    })
}


//get new product form
module.exports.getNewProductForm = function(req,res,next){
  Main_Category.find().exec(function(err,main_categories){
    if(err){return console.log(err)}
    return res.render('new_product',{title:'Create New Product',main_categories:main_categories});

  })
}

//create new product
module.exports.createNewProduct = function(req,res,next){
  var product = new Product({
      name:req.body.name,
      price:req.body.price,
      main_category:req.body.main_category,
      cateogory:req.body.category,
      subcategory:req.body.subcategory,
      color:req.body.color
    })
  req.checkBody('name','Name field must not be empty').isLength({ min: 1 });
  req.checkBody('price','Price field must not be empty').isLength({ min: 1 });
  req.checkBody('main_category','Please select product main category').isLength({ min: 1 });
  req.checkBody('category','Please select product category').isLength({ min: 1 });
  req.checkBody('subcategory','Please select product category').isLength({ min: 1 });

   var errors = req.validationErrors(true);
   if(errors){
    console.log(errors);
     return res.render('new_product',{errors:errors,product:product});
}
  product.save(function(err,data){
    if(err){
      next(err)
    }else{
      var description  =  new Description({
        product: product._id,
        about: '',
        how_to_use : '',
        ingredients : ''
    });
    description.save(function(err,description){
      if(err){
        next(err)
      }else{
        product.description = description._id;
        product.save(function(err,updatedProduct){
          if(err){return next(err)};
          res.redirect('/new/product/description?product_id='+data._id);
        })//product.save
      }//else
    });//description
  }//else
})//product.save
}


//get new product description
module.exports.getNewDescription = function(req,res,next){
    if(!req.query.product_id){
    return res.redirect('/');
  }

  async.parallel({
    description:function(callback){
        Description.findOne({product:req.query.product_id}).exec(callback);
    },
    find_images:function(callback){
      Image.find({product:req.query.product_id}).exec(callback);
    },
  },function(err,results){
     if (err){console.log(err)}
     res.render('new_product_description',{product:results.description,images:results.find_images})
  })//function
}

//update about field
module.exports.update_about = function(req,res,next){
 console.log(module.exports.modifyField('product',req.query.product_id,'about',req.body.data));
 res.send('somedata');
}

//update how to use field
module.exports.update_how_to_use = function(req,res,next){
 console.log(module.exports.modifyField('product',req.query.product_id,'how_to_use',req.body.data));
 res.send('somedata');
}

//update about field
module.exports.update_ingredients = function(req,res,next){
 console.log(module.exports.modifyField('product',req.query.product_id,'ingredients',req.body.data));
 res.send('somedata');
}



//for images
module.exports.uploadImage = function(req,res,next){


  var s3 = new aws.S3({
    apiVersion:'2006-03-01',
    endpoint:'https://s3.eu-west-2.amazonaws.com/',
    accessKeyId:process.env.s3_access_key_id,
    secretAccessKey:process.env.s3_secret_access_key,
    region:'eu-west-2'
  });
  var upload = multer({
   storage: multerS3({
     s3: s3,
     bucket: 'glammycare',
     metadata: function (req, file, cb) {
       cb(null, {fieldName: file.originalname});
     },
     key: function (req, file, cb) {
       cb(null, req.query.filename);
     }
   })
  }).single('image');
  upload(req,res,function(err){
      if(err){
        console.log(err);
        res.send(err);
      }else{
        console.log(req.file);
        res.send(req.file);
      }
    })
}

 module.exports.addImageToProduct = function(req,res,next){
   var image = new Image({
   product:req.body.product_id,
  image : req.body.keyname

});

    image.save(function(err,image){
     if(err){console.log(err)
     }else{
       Product.findById(req.body.product_id).exec(function(err,product){
         product.images.push(image._id);
         product.save(function(err,returnedData){
           if(err){return next(err)}
         })
       })
       res.send('image added');
     }
    })
 }

module.exports.createVariant = function(req,res,next){
  if(!req.query.product_id){
    return res.redirect('/');
  }
  var variant = new Variant({
    color: '',
    product:req.query.product_id
  });

  variant.save(function(err,data){
    if(err){console.log(err)
    }else{
      Product.findById(req.query.product_id).exec(function(err,product){
        product.variants.push(variant._id);
        product.save(function(err,returnedData){
          if(err){return next(err)}
        })
      })
      res.redirect('/new/variant/description?product_id='+req.query.product_id+'&variant_id='+variant._id);
    }
  })//variant
}

//get variant form

module.exports.getVariantForm = function(req,res,next){
    if(!req.query.product_id){
    return res.redirect('/');
  }

  if(!req.query.product_id || !req.query.variant_id){
    return res.redirect('/');
  }
  product_id = req.query.product_id;
  variant_id = req.query.variant_id;

  Variant_Image.find({variant:req.query.variant_id}).exec(function(err,images){
    res.render('new_variant',{product_id:product_id,swatch_id:variant_id,images:images});
  })
}

//update variant color
module.exports.updateVariantColor = function(req,res,next){
  product_id = req.query.product_id;
  variant_id = req.query.variant_id;
  Variant.findOne({product:req.query.product_id,_id:variant_id},function(err,data){
     if(err){console.log(err)};
    data.set({color:req.query.color});
    data.save(function(err,updatedVariant){
      if(err) return console.log(err);
      res.send('description updated');
    })
  })

}


//upload variant image
module.exports.uploadVariantImage = function(req,res,next){
  //add image to variant and product
   var product_id = req.query.product_id;
   var variant_id = req.query.variant_id;

   var image = new Variant_Image({
     product:product_id,
     variant:variant_id,
     image:req.query.filename
   })
   image.save(function(err,savedImage){
     if(err){console.log(err)}
     Variant.update({_id:variant_id},{$push:{'images':image._id}},function(err,updatedVariant){
       if(err){console.log(err)}
     });
   })


    var s3 = new aws.S3({
      apiVersion:'2006-03-01',
      endpoint:'https://s3.eu-west-2.amazonaws.com/',
      accessKeyId:process.env.s3_access_key_id,
      secretAccessKey:process.env.s3_secret_access_key,
      region:'eu-west-2'
    });
    var upload = multer({
     storage: multerS3({
       s3: s3,
       bucket: 'glammycare',
       metadata: function (req, file, cb) {
         cb(null, {fieldName: file.originalname});
       },
       key: function (req, file, cb) {
         cb(null, req.query.filename);
       }
     })
    }).single('image');
    upload(req,res,function(err){
        if(err){
          console.log(err);
          res.send(err);
        }else{
          console.log(req.file);
          res.send(req.file);
        }
      })

  }

//get all Variants
module.exports.getAllVariants = function(req,res,next){
    if(!req.query.product_id){
      return  res.redirect('/');
  };
  async.parallel({
    product:function(callback){
      Product.findById(req.query.product_id).select('name price').exec(callback);
    },
    variants:function(callback){
      Variant.find({product:req.query.product_id}).populate('images').exec(callback);
    },
    count:function(callback){
      Variant.count({product:req.query.product_id}).exec(callback);
    },
  },function(err,results){
    if(err){return next(err)}
    res.render('variants',{variants:results.variants,product:results.product,count:results.count});

  })
}


//delete variant
module.exports.deleteVariant = function(req,res,next){
  var product_id = req.query.product_id;
  var variant_id = req.query.variant_id


   function  deleteVariant(){
      async.parallel({
        delete_variant:function(callback){
          Variant.deleteOne({_id:variant_id}).exec(callback);
        },
        delete_variant_images:function(callback){
         Variant_Image.deleteMany({variant:variant_id}).exec(callback);
       },
       //delete variants ids existing in products
        delete_product_variant:function(callback){
         Product.update({_id:product_id},{$pull:{'variants':req.query.variant_id}}).exec(callback);
       },
     },function(err,results){
       if(err){console.log(err)};
       res.redirect('/variants?product_id='+product_id)
     })
  }

    var s3 = new aws.S3({
      apiVersion:'2006-03-01',
      endpoint:'https://s3.eu-west-2.amazonaws.com/',
      accessKeyId:process.env.s3_access_key_id,
      secretAccessKey:process.env.s3_secret_access_key,
      region:'eu-west-2'
    });

  Variant_Image.find({variant:variant_id}).exec(function(err,returnedImages){
    if(err){console.log(err)}
   var images = [];

   returnedImages.forEach(function(item){
        images.push({"Key":item.image});


   })
   var params = {
     Bucket:'glammycare',
     Delete:{
       Objects:images
     }
   }
    s3.deleteObjects(params,function(err,data){
      if(err){console.log(err)}
      // console.log(data);
      deleteVariant();
    })
  })


}


//delete product
module.exports.deleteProduct = function(req,res,next){
var product_id = req.query.product_id;

     function deleteProduct(){

      async.parallel({
        delete_product:function(callback){
          Product.deleteOne({_id:product_id}).exec(callback);
        },
        delete_description:function(callback){
          Description.deleteOne({product:product_id}).exec(callback);
        },
        delete_variants:function(callback){
          Variant.deleteMany({product:product_id}).exec(callback);
        },
        delete_variant_images:function(callback){
          Variant_Image.deleteMany({product:product_id}).exec(callback);
        },
        delete_images:function(callback){
          Image.deleteMany({product:product_id}).exec(callback);
        }
      },function(err,data){
        if(err){console.log(err)}
        res.redirect('/');
      })
  }//delete product
      var s3 = new aws.S3({
        apiVersion:'2006-03-01',
        endpoint:'https://s3.eu-west-2.amazonaws.com/',
        accessKeyId:process.env.s3_access_key_id,
        secretAccessKey:process.env.s3_secret_access_key,
        region:'eu-west-2'
      });

         var images = [];
         async.parallel({
           find_product_images:function(callback){
             Image.find({product:req.query.product_id}).exec(callback);
          },
          find_variant_images:function(callback){
            Variant_Image.find({product:req.query.product_id}).exec(callback);
          },
        },function(err,returnedData){
          if(err){console.log(err)}
           returnedData.find_product_images.forEach(function(item){
             images.push({"Key":item.image});
           })

           returnedData.find_variant_images.forEach(function(item){
             images.push({"Key":item.image});
           });
           //s3
           var params = {
             Bucket:'glammycare',
             Delete:{
               Objects:images
             }
           }
            s3.deleteObjects(params,function(err,data){
              if(err){console.log(err)}
              // console.log(data);
              deleteProduct();
            })
        });//async.parallel

}


//delete product image
module.exports.deleteProductImage = function(req,res,next){
    var image_key = req.query.image_key;
    var image_id = req.query.image_id;
    var product_id = req.query.product_id;
    var s3 = new aws.S3({
      apiVersion:'2006-03-01',
      endpoint:'https://s3.eu-west-2.amazonaws.com/',
      accessKeyId:process.env.s3_access_key_id,
      secretAccessKey:process.env.s3_secret_access_key,
      region:'eu-west-2'
    });
    var params = {
      Bucket:'glammycare',
      Key:image_key
    }
    s3.deleteObject(params,function(err,deletedimage){
      if(err){ return console.log(err)};
         async.parallel({
           delete_image:function(callback){
              Image.deleteOne({_id:image_id}).exec(callback);
           },
           update_product:function(callback){
            Product.update({_id:product_id},{$pull:{images:image_id}}).exec(callback);
           }
      },function(err,results){
        if(err){console.log(err)}
        res.send('image deleted');
    });
})//s3

}


//delete product image
module.exports.deleteVariantImage = function(req,res,next){
    var image_key = req.query.image_key;
    var image_id = req.query.image_id;
    var variant_id = req.query.variant_id;
    var s3 = new aws.S3({
      apiVersion:'2006-03-01',
      endpoint:'https://s3.eu-west-2.amazonaws.com/',
      accessKeyId:process.env.s3_access_key_id,
      secretAccessKey:process.env.s3_secret_access_key,
      region:'eu-west-2'
    });
    var params = {
      Bucket:'glammycare',
      Key:image_key
    }
      s3.deleteObject(params,function(err,deletedimage){
        if(err){ return console.log(err)};
           async.parallel({
             delete_image:function(callback){
                Variant_Image.deleteOne({_id:image_id}).exec(callback);
             },
             update_variant:function(callback){
              Variant.update({_id:variant_id},{$pull:{images:image_id}}).exec(callback);
             }
        },function(err,results){
          if(err){console.log(err)}
          res.send('image deleted');
      });
  })//s3

}
