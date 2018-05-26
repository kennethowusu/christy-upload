var express = require('express');
var router = express.Router();
var productController = require('../controller/productController');
/* GET home page. */
router.get('/', productController.getProducts);


//get new product form
router.get('/new/product',productController.getNewProductForm);


//create new product
router.post('/new/product',productController.createNewProduct);

//create new product description
router.get('/new/product/description',productController.getNewDescription);


//update abot
router.post('/new/product/description/about',productController.update_about);


//update how_to_use
router.post('/new/product/description/how_to_use',productController.update_how_to_use);


//update  ingredients
router.post('/new/product/description/ingredients',productController.update_ingredients);

// upload image
router.post('/new/product/description/image',productController.uploadImage);

//add image to product field
router.post('/new/product/description/image_to_product',productController.addImageToProduct);
module.exports = router;

//for variants
//create new variant
router.get('/new/variant',productController.createVariant);

//create new variant description
router.get('/new/variant/description',productController.getVariantForm);

//update varinat cololr
router.post('/new/variant/description/color',productController.updateVariantColor);

//variant image
router.post('/new/variant/description/image',productController.uploadVariantImage);

//get all Variants
router.get('/variants',productController.getAllVariants);

router.get('/variant/delete',productController.deleteVariant);

//delete products
router.get('/product/delete',productController.deleteProduct);
