angular.module('payment.controllers')
  .controller('ctrl.cvPaymentMethodThree', [
    '$scope',
    '$sce',
    '$filter',

    'Currency',

    function($scope, $sce, $filter, Currency) {

      // Scope Variables
      angular.extend($scope, {

      });

      // Scope Methods
      angular.extend($scope, {
        getPlaceOrderText: function() {
          if (!$scope.mode || !$scope.currency) return $sce.trustAsHtml('<span>LOADING...</span>');

          return $sce.trustAsHtml('PAY <span>' + Currency($scope.currency + '-white') + '	</span>' + $filter('number')($scope.amount) + '</span> SECURELY');
        }
      })
    }
  ]);
