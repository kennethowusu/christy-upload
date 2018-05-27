var express = require('express');
var router = express.Router();
var categoryController = require('../controller/categoryController');




//get all categories
router.get('/',categoryController.getAllCategories);


//create cateogry
router.get('/add',categoryController.getMainCategoryForm);

//create cateogry
router.post('/add',categoryController.createMainCategory);



//get sub category form
router.get('/subcategory/add',categoryController.getSubCategoryForm);

//create subCategory
router.post('/subcategory/add',categoryController.createSubCategory);

//find subcategory
router.post('/find/subcategories',categoryController.findSubCategories);
module.exports = router;
