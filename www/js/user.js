angular.module('starter.services')
.factory('User', [ '$http',  'BASE_URL', function($http, BASE_URL) {

  var base = BASE_URL.get();
  var API = { };
  var Users = [];
  var Token = "";

  // 'get /3/users'                        : 'UsersController.getAll',
  // 'get /3/users/:id'                    : 'UsersController.getOne',
  // 'post /3/users'                       : 'UsersController.create',
  // 'put /3/users'                        : 'UsersController.update',
  // 'delete /3/users/:id'                 : 'UsersController.delete',

  API.fetch = function() {
    return $http({
      method: 'GET',
      url:  BASE_URL.get() + 'users',
    }).then(function(res) {
      if( typeof(res.data.users) != 'undefined' ) {
        return Users = res.data.users
      }
    }, function(err) {
      $ionicLoading.hide();
      return [];
    });
  } // end login
  API.update = function(user) {
    return $http({
      method: 'PUT',
      url:  BASE_URL.get() + 'users',
      data: user,
    }).then(function(res) {
      return res.data;
    }, function(err) {
      $ionicLoading.hide();
      return [];
    });
  }
  API.get = function() {
    return Users;
  }
  API.destroy = function() {

  }
  return API;
}]);
