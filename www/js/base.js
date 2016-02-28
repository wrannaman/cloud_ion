angular.module('starter.services')
.factory('BASE_URL', [function() {
 console.error('* * * Base Url is on base_local * * *');
  var base_local       = "http://localhost:1337/";
  var base_prod        = "https://.sd.f..com";
  var base_local2      = "http://localhost:1337/";

  var API = { };
  API.get = function() {
    return base_local;
  }
  API.get2 = function() {
    return base_local2;
  }

  return API;
}]);
