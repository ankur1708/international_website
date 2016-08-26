angular.module('shipping.controllers')
  .controller('ctrl.cvAddressForm', [
    '$scope',
    'shippingHttpService',

    function($scope, shippingHttpService) {
      // Scope Variables
      angular.extend($scope, {

      })

      // Scope methods
      angular.extend($scope, {
        changePincode: function() {
          if (!$scope.address.postcode) return;

          if ($scope.address.country_obj.country_name == "India") {
            $scope.citystateWait = true;

            shippingHttpService.getAddressFromPincode($scope.address.postcode)
              .success(function(response) {
                $scope.citystateWait = false;
                //console.log(response);
                if (response.s == 1) {
                  $scope.address.city = response.d[0].city;
                  $scope.address.state = response.d[0].state;
                  $scope.address.region = response.d[0].state;
                }
              })
              .error(function(error) {
                //console.log('Error');
              });
          }
        }
      })
    }
  ]);
