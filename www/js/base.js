angular.module('starter.services')
.factory('BASE_URL', [function() {
 console.error('* * * Base Url is on base_local * * *');
  var base_local       = "http://localhost:1337/3/";
  var base_prod        = "https://.sd.f..com";

  var API = { };
  API.get = function() {
    return base_local;
  }

  return API;
}]);
