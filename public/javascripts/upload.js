var about;
var how_to_use;
var ingredients;
var product_id = $('#product_id').val();
var image =  document.getElementById('image');
var variant_id = $('#swatch_id').val();
var swatch_image = document.getElementById('swatch_image');

//replace fileds with ck_editor
// function replace_ck_editor(id_to_select,name_to_give){
//     ClassicEditor
//       .create( document.querySelector( id_to_select ) )
//       .then( editor => {
//           name_to_give = editor;
//       } )
//       .catch( error => {
//           console.error( error );
//       } );
// }

//
// //repalce fields with  ck_editor
// replace_ck_editor("#about",about);
// replace_ck_editor('#how_to_use',how_to_use);
// replace_ck_editor('#ingredients',ingredients);


        ClassicEditor
        .create( document.querySelector( '#about' ) )
        .then( editor => {
          about = editor;
        } )
        .catch( error => {
          console.error( error );
        } );

        ClassicEditor
        .create( document.querySelector( '#how_to_use' ) )
        .then( editor => {
            how_to_use = editor;
        } )
        .catch( error => {
            console.error( error );
        } );

        ClassicEditor
          .create( document.querySelector( '#ingredients' ) )
          .then( editor => {
              ingredients = editor;
          } )
          .catch( error => {
              console.error( error );
          } );


//for notifications
  function showSaving(){
    $('.saving').show();
  }
  function showSaved(){
    $('.saving').hide();
    $('.saved').show();
    if($('.saved').is(':visible')){
      $('.saved').fadeOut(4000);
    }
  }



//update products
function update_to_product_description(field_data,url){
    var data = {}
    data['data'] = field_data.getData();
    showSaving();
    $.ajax({
      type:'post',
      url:'/new/product/description/'+url+'?product_id='+product_id,
      data: data
    }).done(function(result){
      showSaved();
      console.log(result);
    })
}

//modify about
$('div,p').on('focusout',function(e){
  if($(e.target).parents().is('#about_field')){
  update_to_product_description(about,'about');

  }
})

//modify how_to_use
$('div,p').on('focusout',function(e){
  if($(e.target).parents().is('#how_to_use_field')){
  update_to_product_description(how_to_use,'how_to_use');

  }
})

//modiyf ingredients

$('div,p').on('focusout',function(e){
  if($(e.target).parents().is('#ingredients_field')){
  update_to_product_description(ingredients,'ingredients');

  }
})



//FOR IMAGES
image.onchange = function(){
  var formdata = new FormData();
  var files = image.files;
  var file = files[0];
  formdata.append('image',file);

  if(this.dataset.type == 'parent'){
  uploadImage(formdata,file.name);
   }else{
   uploadVariantImage(formdata,file.name);
   }
}

//upload image
function uploadImage(formdata,filename){
  $('.loader-div').css('display','flex');
  var xhr = new XMLHttpRequest();
  xhr.open('post','/new/product/description/image?filename='+filename);

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      $('.loader-div').hide();
      var result = JSON.parse(xhr.responseText);
      $('.uploaded-photos').append(`<div class="image-preview"> <div class="image-preview__img"><img src="${result.location}" alt="" class="control"></div><div class="image-preview__action"><input class='image_key' type="hidden" value="${result.key}"><button  type="button" class="image-preview__btn"><img src="/images/delete.svg" alt="" class="image-preview__delete">Delete photo</button></div></div>`);
      addImageToProduct(product_id,result.key);
    }
  }
  xhr.send(formdata);
}

//add uploaded image to the product
function addImageToProduct(product_id,keyname){
  var data = {keyname:keyname,product_id:product_id};
  $.ajax({
    type:"post",
    url:('/new/product/description/image_to_product?image_key='+keyname),
    data:data
  }).done(function(result){
    console.log('image added to product');
  })
}

//FOR VARIANT

//update  variant color
$('#variant_color').on('focusout',function(e){
   $('.saving').show();
  var data =  $(e.target).val();
   $.ajax({
     type:'post',
     url:'/new/variant/description/color?color='+data+'&product_id='+product_id+'&variant_id='+variant_id
   }).done(function(result){
     showSaved();
     console.log('done');
   })
})

//upload variant image
function uploadVariantImage(formdata,filename){
  $('.loader-div').css('display','flex');
  var xhr = new XMLHttpRequest();
  xhr.open('post','/new/variant/description/image?filename='+filename+'&variant_id='+variant_id+'&product_id='+product_id);

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      $('.loader-div').hide();
      var result = JSON.parse(xhr.responseText);
      $('.uploaded-photos').append(`<div class="image-preview"> <div class="image-preview__img"><img src="${result.location}" alt="" class="control"></div><div class="image-preview__action"><input class='image_key' type="hidden" value="${result.key}"><button  type="button" class="image-preview__btn"><img src="/images/delete.svg" alt="" class="image-preview__delete">Delete photo</button></div></div>`);

    }
  }
  xhr.send(formdata);
  console.log('hahaha this is variant image wae');
}
