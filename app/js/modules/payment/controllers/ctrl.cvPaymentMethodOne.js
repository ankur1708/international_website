angular.module('payment.controllers')
  .controller('ctrl.cvPaymentMethodOne', [
    '$scope',
    '$sce',
    '$filter',

    'Currency',

    function($scope, $sce, $filter, Currency) {

      // Scope Variables
      angular.extend($scope, {
        Currency: Currency
      });

      // Scope Methods
      angular.extend($scope, {
        getPlaceOrderText: function() {
          if (!$scope.currency || !$scope.amount) return $sce.trustAsHtml('<span>LOADING...</span>');
          switch ($scope.mode.toLowerCase()) {
            case 'cash on delivery':
              return $sce.trustAsHtml('<span>PLACE ORDER</span>');
            case 'payu money':
              return $sce.trustAsHtml('<span>PLACE ORDER</span>');
            case 'paypal':
              return $sce.trustAsHtml('PAY <span>' + Currency($scope.currency + '-white') + '	</span>' + $filter('number')($scope.amount) + '</span> SECURELY');
            default:
              return $sce.trustAsHtml('<span>LOADING...</span>');
          }
        },
      })
    }
  ]);
