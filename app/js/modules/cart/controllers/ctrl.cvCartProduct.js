angular.module('cart.controllers')
.controller('ctrl.cvCartProduct', [
    '$scope',
    'Currency',

    function($scope, Currency) {
      // Scope Variables
      angular.extend($scope, {
        quantityOptions: (function() {
          var a = [];
          for (var i = 1; i < 10; i++) {
            a.push({
              id: i,
              'label': i
            })
          }
          return a;
        })(),
        Currency: Currency
      })

      // Scope methods
      angular.extend($scope, {
        initializeQuantity: function(data) {
          data.quantity = $scope.quantityOptions[data.product_qty - 1];
        },
        showNoteToSeller: function(data) {
          data.showFormNote = true;
        },
        hideNoteToSeller: function(data) {
          data.showFormNote = false;
        },
        init: function() {

        }
      })

      $scope.init();
    }
]);
