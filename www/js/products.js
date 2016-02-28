angular.module('starter.services')
.factory('Products', [ '$http',  'BASE_URL', 'User', function($http, BASE_URL, User) {

  var base = BASE_URL.get();
  var API = { };
  var Products = [];
  var Token = "";

  // 'get  /3/products'                    : 'ProductsController.all' ,
  // 'get  /3/products/:id'                : 'ProductsController.one' ,
  // 'post /3/products'                    : 'ProductsController.create',
  // 'put /3/products'                     : 'ProductsController.update',
  // 'delete /3/products/:id'              : 'ProductsController.delete',

  API.fetch = function(user) {
    return $http({
      method: 'GET',
      url:  BASE_URL.get() + 'products/all/' + user.id,
    }).then(function(res) {
      console.log('products res', res);
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
  API.fetchOne = function(id) {
    console.log('fetch one id', id);
    return $http({
      method: 'GET',
      url:  BASE_URL.get() + 'products/' + id,
    }).then(function(res) {
      return res.data;
    }, function(err) {
      return [];
    });
  }
  API.update = function(product) {
    product.user = User.getThis().id;
    if (typeof(product.photo) === 'undefined') product.photo = null;
    console.log('saving product', JSON.stringify(product));
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
  API.create = function(product) {
    product.user = User.getThis();
    if (typeof(product.photo) === 'undefined') product.photo = null;
    return $http({
      method: 'POST',
      url:  BASE_URL.get() + 'products',
      data: product,
    }).then(function(res) {
      return res.data;
    }, function(err) {
      return [];
    });
  }
  API.delete = function(id) {
    return $http({
      method: 'DELETE',
      url:  BASE_URL.get() + 'products/' + id,
    }).then(function(res) {
      return res.data;
    }, function(err) {
      return [];
    });
  }
  return API;
}]);
