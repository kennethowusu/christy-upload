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


//find categories
router.post('/find/categories',categoryController.findCategories);

//get category form
router.get('/category/add',categoryController.getCategoryForm);

router.post('/category/add',categoryController.createCategory);


module.exports = router;
