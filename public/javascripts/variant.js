var product_id = $('#product_id').val();
var swatch_id = $('#swatch_id').val();
var swatch_image = document.getElementById('swatch_image');
//FOR NOTIFICATIONS
function showSaved(){
  $('.saving').hide();
  $('.saved').show();
  if($('.saved').is(':visible')){
    $('.saved').fadeOut(4000);
  }
}

//FOR SWATCH

$('#swatch_color').on('focusout',function(e){
   $('.saving').show();
  var data =  $(e.target).val();
   $.ajax({
     type:'post',
     url:'/upload/new/swatch/description/swatch_color?color='+data+'&product_id='+product_id+'&swatch_id='+swatch_id,

   }).done(function(result){
     showSaved();
     console.log('done');
   })



})




swatch_image.onchange = function(){
  var formdata = new FormData();
  var files = swatch_image.files;
  var file = files[0];

  formdata.append('image',file);
  uploadImage(formdata,file.name);

}


//upload image
function uploadImage(formdata,filename){
  $('.loader-div').css('display','flex');
  var xhr = new XMLHttpRequest();
  xhr.open('post','/upload/new/swatch/description?swatch_id='+swatch_id+'&product_id='+product_id+'&filename='+filename);

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      $('.loader-div').hide();
      var result = JSON.parse(xhr.responseText);
      $('.uploaded-photos').append(`<div class="image-preview"> <div class="image-preview__img"><img src="${result.location}" alt="" class="control"></div><div class="image-preview__action"><input class='image_key' type="hidden" value="${result.key}"><button  type="button" class="image-preview__btn"><img src="/images/delete.svg" alt="" class="image-preview__delete">Delete photo</button></div></div>`);
      // addImageToSwatch(swatch_id,result.key);
    }
  }
  xhr.send(formdata);
}

// //add uploaded image to the product
// function addImageToSwatch(swatch_id,keyname){
//   var data = {keyname:keyname,swatch_id:swatch_id};
//   $.ajax({
//     type:"post",
//     url:('/upload/new/swatch/description/image?image_key='+keyname),
//     data:data
//   }).done(function(result){
//     console.log('image added to product');
//   })
// }
