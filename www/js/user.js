angular.module('starter.services')
.factory('User', [ '$http',  'BASE_URL', function($http, BASE_URL) {

  var base = BASE_URL.get();
  var base2 = BASE_URL.get2();

  var API = { };
  var Users = [];
  var Token = "";
  var ThisUser = {};

  // 'get /3/users'                        : 'UsersController.getAll',
  // 'get /3/users/:id'                    : 'UsersController.getOne',
  // 'post /3/users'                       : 'UsersController.create',
  // 'put /3/users'                        : 'UsersController.update',
  // 'delete /3/users/:id'                 : 'UsersController.delete',

  API.fetch = function() {
    console.log('fetching users');
    return $http({
      method: 'GET',
      url:  BASE_URL.get2() + 'user',
    }).then(function(res) {
      console.log('res', res);
      if( typeof(res.data) != 'undefined' ) {
        return Users = res.data
      }
    }, function(err) {
      return [];
    });
  } // end login
  API.logout = function() {
    return $http({
      method: 'GET',
      url:  BASE_URL.get2() + 'logout',
    }).then(function(res) {
      console.log('res', res);
      return "ok";
    }, function(err) {
      return [];
    });
  }
  API.register = function(user){
    user.username = user.email;
    return $http({
      method: 'post',
      url:  BASE_URL.get2() + 'auth/local/register',
      data: user,
    }).then(function(res) {
      return res;
    }, function(err) {
      return [];
    });
  }
  API.login = function(user){
    user.identifier = user.email;
    return $http({
      method: 'post',
      url:  BASE_URL.get2() + 'auth/local',
      data: user,
    }).then(function(res) {
      ThisUser = res.data.user;
      return res.data;
    }, function(err) {
      return {};
    });
  }
  API.update = function(user) {
    console.log('user', user);
    return $http({
      method: 'PUT',
      url:  BASE_URL.get() + 'users',
      data: user,
    }).then(function(res) {
      return res.data;
    }, function(err) {
      return [];
    });
  }
  API.getThis = function(){
    return ThisUser;
  }
  API.get = function() {
    return Users;
  }
  API.destroy = function() {

  }
  return API;
}]);
