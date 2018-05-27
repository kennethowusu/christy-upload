var Main_Category = require('../models/mainCategoryModel');
var Sub_Category = require('../models/subCategoryModel');
var Category = require('../models/categoryModel');
var async = require('async');


module.exports.getAllCategories = function(req,res,next){
  async.parallel({
    main_categories:function(callback){
      Main_Category.find().exec(callback);
    },
    sub_categories:function(callback){
      Sub_Category.find().exec(callback);
    },
  },function(err,results){
    if(err){return next(err)};
    return res.render('categories',{main_categories:results.main_categories,sub_categories:results.sub_categories});

  })
}


module.exports.getMainCategoryForm = function(req,res,next){
  return res.render('main_category_add',{title:'Create main category'});

}

//create main category
module.exports.createMainCategory = function(req,res,next){
  var category = new Main_Category({
    d_name : req.body.d_name,
    name : req.body.name
  });

  category.save(function(err,category){
    if(err){return next(err)};

  })
  res.redirect('/category');
}


//get subcategory form
module.exports.getSubCategoryForm = function(req,res,next){
  res.render('main_category_add');
}
//create sub category
module.exports.createSubCategory = function(req,res,next){
  var sub_category = new Sub_Category({
    main_category : req.query.main_category_id,
    d_name:req.body.name,
    name: req.body.name
  })

  sub_category.save(function(err,subcategory){
    if(err){return next(err)}
    res.redirect('/category');
  })
}


//find subcategories
module.exports.findSubCategories = function(req,res,next){
  Sub_Category.find({main_category:req.query.main_category_id}).exec(function(err,subcategories){
    if(err){return console.log(err)}
    return res.send(subcategories);
  })

}
