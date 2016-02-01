angular.module('starter.services')
.factory('Photo', [ '$http',  'BASE_URL', function($http, BASE_URL) {

  var base = BASE_URL.get();
  var API = {};

  // 'get  /3/products'                    : 'ProductsController.all' ,
  // 'get  /3/products/:id'                : 'ProductsController.one' ,
  // 'post /3/products'                    : 'ProductsController.create',
  // 'put /3/products'                     : 'ProductsController.update',
  // 'delete /3/products/:id'              : 'ProductsController.delete',

  API.upload_photo = function(data) {
    console.log('base');
    return $http({
      method: 'POST',
      url: BASE_URL.get() + "upload_photo",
      data: {
        img: data,
        //user_id: User.get().id,
      }
    }).then(function(res){
      console.log('success upload_photo', res);
      return res.data;
    }, function(err) {
      //console.log('error upload_photo', err);
      return err;
    });

  } // end login
  API.get = function() {
    return Products;
  }
  API.update = function(product) {
    product.user = "56a41c15c2bea6f40ea2402b";
    return $http({
      method: 'PUT',
      url:  BASE_URL.get() + 'products',
      data: product,
    }).then(function(res) {
      return res.data;
    }, function(err) {
      return [];
    });
  }
  API.destroy = function() {

  }
  return API;
}]);
