angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  //$scope.loginData = {};

  // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  //
  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };
  //
  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };
  //
  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);
  //
  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('UsersCtrl', function($scope, $http, $ionicLoading, User) {
  $ionicLoading.show();

  $scope.users = [];
  User.fetch()
  .then(function(users){
    console.log('users', users);
    $scope.users = users;
    $ionicLoading.hide();
  });
})

.controller('UserCtrl', function($scope, User, $stateParams, $ionicLoading) {
  $scope.users = User.get();
  $scope.user = $scope.users[$stateParams.id];
  var userCopy = $scope.user;
  userCopy = {
    firstName: $scope.user.firstName,
    lastName: $scope.user.lastName,
    email: $scope.user.email,
  }

  $scope.update = function() {


    if (userCopy.firstName == $scope.user.firstName && userCopy.lastName == $scope.user.lastName && userCopy.email == $scope.user.email) return alert('No changes were made.');

    var emailRx = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var letRx = /^[a-zA-Z]*$/;

    if (!emailRx.test($scope.user.email)){
      return alert('email is not in the correct format')
    }
    if(!letRx.test($scope.user.firstName)){
      return alert('first name can only contain letters')
    }
    if(!letRx.test($scope.user.lastName)){
      return alert('last name can only contain letters')
    }

    $ionicLoading.show();

    User.update($scope.user)
    .then(function(updated){
      $ionicLoading.hide();
      if (typeof(updated.error) !== 'undefined' && updated.user && updated.user.length === 1) {
        $scope.user = updated.user[0];
        alert('User updated successfully.');
        userCopy = {
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: $scope.user.email,
        }
      } else {
        $scope.user.firstName = userCopy.firstName;
        $scope.user.lastName = userCopy.lastName;
        $scope.user.email = userCopy.email;
        alert('Error: ' + JSON.stringify(updated.error[0]))
      }
    })
    .catch(function(error){
      $ionicLoading.hide();
    })
  }

  //   firstName  : { type: "string" },
  // lastName   : { type: "string" },
  // email      : { type: "string", unique: true },
  // password   : { type: "string", required: true },

  console.log('UserCtrl stateParams', $stateParams);
})

.controller('ProductsCtrl', function($scope, User, $stateParams, BASE_URL, $ionicLoading, Products) {
  console.log('products!');
  $scope.products = [];
  Products.fetch()
  .then(function(products){
    $scope.products = products;
    $scope.products = $scope.products.map(function(p,i){
      if(p.photo) p.photo = BASE_URL.get().replace('/3/', '') + '/' + p.photo.replace('/3/', '');
      console.log('p photo', p.photo);
      return p;
    })
    //console.log('products', JSON.stringify(products));

  })

})

.controller('ProductCtrl', function($scope, $sce, User, $timeout, BASE_URL, $stateParams, $ionicLoading, Products, $cordovaCamera, Photo) {
  console.log('products!');
  $scope.products = Products.get();
  $scope.product = $scope.products[$stateParams.id];
  $scope.newImage = false;
  $scope.trust = function(src){
    return $sce.trustAsResourceUrl(src);
  }

  var pCopy = $scope.product;
  pCopy = {
    name: $scope.product.name,
    cost: $scope.product.cost,
    quantity: $scope.product.quantity,
    photo: $scope.product.photo,
  }

  $scope.products = [];
  Products.fetch()
  .then(function(products){
    $scope.products = products;
    console.log('products', products);
  });

  $scope._upload_photo = function(name) {
    Photo.upload_photo( name )
    .then(function( res ){
      console.log('res', JSON.stringify(res));
      $scope.newPhoto = true;
      $scope.product.photo = res.image;
      var url =  BASE_URL.get().replace('/3', "") + res.image;
    })
  }

  $scope.resetOrig = function(){
    $scope.product.name = pCopy.name;
    $scope.product.cost = pCopy.cost;
    $scope.product.quantity = pCopy.quantity;
  }
  $scope.update = function() {
    console.log($scope.product);

    if (pCopy.name == $scope.product.name && pCopy.cost == $scope.product.cost && pCopy.quantity == $scope.product.quantity && !$scope.newPhoto) return alert('No changes were made.');

    var letRx = /^[a-z A-Z]*$/;

    if(!letRx.test($scope.product.name)){
      $scope.resetOrig();
      return alert(' name can only contain letters');
    }

    if (!angular.isNumber($scope.product.cost)) {
        $scope.resetOrig();
      return alert('cost cost must be a number');
    }

    if (!angular.isNumber($scope.product.quantity)) {
        $scope.resetOrig();
      return alert('quantity cost must be a number');
    }

    if( $scope.product.quantity < 0 ){
        $scope.resetOrig();
      return alert('quantity must be greater than or equal to zero');
    }
    if( $scope.product.cost < 0 ){
        $scope.resetOrig();
      return alert('cost must be greater than or equal to zero');
    }

    $ionicLoading.show();

    Products.update($scope.product)
    .then(function(updated){
      $ionicLoading.hide();
      console.log('updated', JSON.stringify(updated));
      if (typeof(updated.error) !== 'undefined' && updated.product && updated.product.length === 1) {
        $scope.product = updated.product[0];
        alert('Product updated successfully.');
      } else {
        $scope.resetOrig();
        alert('Error: ' + JSON.stringify(updated.error[0]))
      }
    })
    .catch(function(error){
      $ionicLoading.hide();
    })
  }
  $scope.cam_options = {
      quality: 20,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 600,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
  };
  $scope.photo = function(){
    if (true) $scope.cam_options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

    $cordovaCamera.getPicture($scope.cam_options).then(function(imageData) {
      console.log('imageData', imageData);
      $scope._upload_photo(imageData);

      var image = document.getElementById('test');
      image.src = "data:image/jpeg;base64," + imageData;

      //console.log('imageData', imageData);
      $cordovaCamera.cleanup();
    }, function(err) {
      //console.log('camera error', err);
      $cordovaCamera.cleanup();
    });
  }


});
