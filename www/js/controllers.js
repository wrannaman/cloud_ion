angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

// .controller('UsersCtrl', function($scope, $http, $ionicLoading, User) {
//   $ionicLoading.show();
//
//   $scope.users = [];
//   User.fetch()
//   .then(function(users){
//     console.log('users', users);
//     $scope.users = users;
//     $ionicLoading.hide();
//   });
// })

.controller('ProfileCtrl', function($scope, User, $stateParams, $ionicLoading) {
  $scope.user = User.getThis();
  console.log('users', $scope.user);
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
      console.log('updated', updated);
      if (updated.error.length === 0) return alert('Your profile was updated.')
      // if (typeof(updated.error) !== 'undefined' && updated.user && updated.user.length === 1) {
      //   $scope.user = updated.user[0];
      //   alert('User updated successfully.');
      //   userCopy = {
      //     firstName: $scope.user.firstName,
      //     lastName: $scope.user.lastName,
      //     email: $scope.user.email,
      //   }
      // } else {
      //   $scope.user.firstName = userCopy.firstName;
      //   $scope.user.lastName = userCopy.lastName;
      //   $scope.user.email = userCopy.email;
      //   alert('Error: ' + JSON.stringify(updated.error[0]))
      // }
    })
    .catch(function(error){
      $ionicLoading.hide();
    })
  }


})

.controller('ProductsCtrl', function($scope, User, $stateParams, BASE_URL, $ionicLoading, Products, $ionicModal) {
  console.log('products!');
  $scope.user = User.getThis();
  $scope.products = [];
  $scope.newProduct = {};
  Products.fetch($scope.user)
  .then(function(products){
    console.log('products in ctrl', products);
    $ionicLoading.hide();
    $scope.products = products;
    if ($scope.products.length === 0) return;
    $scope.products = $scope.products.map(function(p,i){
      if(p.photo) p.photo = BASE_URL.get().replace('/3/', '') + '/' + p.photo.replace('/3/', '');
      console.log('p photo', p.photo);
      return p;
    })
  })

    $ionicModal.fromTemplateUrl('templates/addProduct.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      console.log('modal', modal);
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      console.log('open modal');
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
      $ionicLoading.show();
      Products.fetch($scope.user)
      .then(function(products){
        console.log('products in ctrl', products);
        $ionicLoading.hide();
        $scope.products = products;
        if ($scope.products.length === 0) return;
        $scope.products = $scope.products.map(function(p,i){
          if(p.photo) p.photo = BASE_URL.get().replace('/3/', '') + '/' + p.photo.replace('/3/', '');
          console.log('p photo', p.photo);
          return p;
        })
      })
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
 $scope.saveProduct = function(){
   console.log('new product', $scope.newProduct);
   var seasons = [];
   if ( $scope.newProduct.winter) seasons.push('winter');
   if ( $scope.newProduct.spring) seasons.push('spring');
   if ( $scope.newProduct.summer) seasons.push('summer');
   if ( $scope.newProduct.fall) seasons.push('fall');
   $scope.newProduct.season = seasons;

   Products.create($scope.newProduct)
   .then(function(response){
     console.log('response', response);
     if (typeof(response.error) !== 'undefined' && response.error.length === 0) {
       alert('product created');
       $scope.closeModal();
     }
   })
 }

})

.controller('ProductCtrl', function($scope, $sce, User, $timeout, BASE_URL, $stateParams, $ionicLoading, Products, $location, $cordovaCamera, Photo) {
  console.log('products!', $stateParams.id);
  $scope.product = {};
  var pCopy;
  Products.fetchOne($stateParams.id)
  .then(function(product){

    console.log('product', JSON.stringify(product));
    $scope.product = product.products;
    if ($scope.product.season.indexOf('winter') !== -1 ) $scope.product.winter = true
    else $scope.product.winter = false;
    if ($scope.product.season.indexOf('spring') !== -1 ) $scope.product.spring = true
    else $scope.product.spring = false;
    if ($scope.product.season.indexOf('summer') !== -1 ) $scope.product.summer = true
    else $scope.product.summer = false;
    if ($scope.product.season.indexOf('fall') !== -1 ) $scope.product.fall = true
    else $scope.product.fall = false;

    pCopy = {
      name: $scope.product.name,
      cost: $scope.product.cost,
      quantity: $scope.product.quantity,
      photo: $scope.product.photo,
      season: $scope.product.season,
      gender: $scope.product.gender,
    }
  });


  //$scope.products = [];
  // Products.fetch()
  // .then(function(products){
  //   $scope.products = products;
  //   console.log('products', products);
  // });

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

    if (pCopy.name == $scope.product.name && pCopy.cost == $scope.product.cost
      && pCopy.quantity == $scope.product.quantity && !$scope.newPhoto
      && $scope.product.gender === pCopy.gender && $scope.product.winter === pCopy.winter && $scope.product.spring === pCopy.spring && $scope.product.summer === pCopy.summer && $scope.product.fall === pCopy.fall) return alert('No changes were made.');

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

    var seasons = [];
    if ( $scope.product.winter) seasons.push('winter');
    if ( $scope.product.spring) seasons.push('spring');
    if ( $scope.product.summer) seasons.push('summer');
    if ( $scope.product.fall) seasons.push('fall');
    $scope.product.season = seasons;

    $ionicLoading.show();

    Products.update($scope.product)
    .then(function(updated){
      $ionicLoading.hide();
      console.log('updated', JSON.stringify(updated));
      if (typeof(updated.error) !== 'undefined' && updated.product && updated.product.length === 1) {
        $scope.product = updated.product[0];
        alert('Product updated successfully.');
        $location.url('/app/products');
      } else {
        $scope.resetOrig();
        alert('Error: ' + JSON.stringify(updated))
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
      //console.log('imageData', imageData);
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


  $scope.delete = function(){
    $ionicLoading.show();
    Products.delete($scope.product.id)
    .then(function(response){
      $ionicLoading.hide();
      console.log('resonpse', JSON.stringify(response));
      $location.url('/app/products');
    })
  }

})

.controller('LoginCtrl', function($scope, $sce, User, $timeout, BASE_URL, $stateParams, $ionicLoading, Products, $cordovaCamera, Photo, $location) {
  console.log('login!');
  $scope.user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }
  $scope.login = function(){
    console.log('user', $scope.user);
    if ( typeof($scope.user.email) === 'undefined' ) return alert('Email format is invalid.');
    if ( !$scope.user.email ) return alert('please enter your email');
    if ( !$scope.user.password ) return alert('please enter your password');
    $ionicLoading.show();
    User.login($scope.user)
    .then(function(response){
      console.log('login res', JSON.stringify(response));
      $ionicLoading.hide();
      if ( typeof(response.success) !== 'undefined' && response.success ) {
        console.log('should redirect');
        return $location.url('/app/products')
      }
      if ( typeof(response.error) !== 'undefined' && response.error === 'Error.Passport.Password.Wrong') {
        return alert('Password incorrect.')
      }
    })
  }
})


.controller('RegisterCtrl', function($scope, $sce, User, $timeout, BASE_URL, $stateParams, $ionicLoading, Products, $cordovaCamera, Photo, $location) {
  console.log('RegisterCtrl!');
  $scope.user = {
    email: '',
    password: '',
  }
  $scope.login = function(){
    $ionicLoading.show();
    console.log('user', $scope.user);
    if ( typeof($scope.user.email) === 'undefined' ) return alert('Email format is invalid.');
    if ( !$scope.user.email ) return alert('please enter your email');
    if ( !$scope.user.password ) return alert('please enter your password');
    User.register($scope.user)
    .then(function(response){
      $ionicLoading.hide();
      console.log('response', JSON.stringify(response));
      if (response.data.error === "Error.Passport.User.Exists") {
        return alert(' This user already exists. Try logging in. ')
      }
      if ( typeof(response.data.success) !== 'undefined' && response.data.success){
        alert('Registration Successfull, please login');
        $location.url('/login');
      }
    })
  }
})
