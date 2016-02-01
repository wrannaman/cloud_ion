angular.module('starter.services')
.factory('Products', [ '$http',  'BASE_URL', function($http, BASE_URL) {

  var base = BASE_URL.get();
  var API = { };
  var Products = [];
  var Token = "";

  // 'get  /3/products'                    : 'ProductsController.all' ,
  // 'get  /3/products/:id'                : 'ProductsController.one' ,
  // 'post /3/products'                    : 'ProductsController.create',
  // 'put /3/products'                     : 'ProductsController.update',
  // 'delete /3/products/:id'              : 'ProductsController.delete',

  API.fetch = function() {
    return $http({
      method: 'GET',
      url:  BASE_URL.get() + 'products',
    }).then(function(res) {
      if( typeof(res.data.products) != 'undefined' ) {
        return Products = res.data.products
      }
    }, function(err) {
      return [];
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
