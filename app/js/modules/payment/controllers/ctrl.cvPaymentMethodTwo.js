angular.module('payment.controllers')
  .controller('ctrl.cvPaymentMethodTwo', [
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
        validate: function(element, form) {
          switch (element) {
            case 'cardNumber':
              return form[element].$invalid && !form[element].$pristine && form[element].$xblur;
            case 'cardName':
              return form[element].$invalid && !form[element].$pristine && form[element].$xblur;
            case 'cardExp':
              {
                if ($scope.mode.toLowerCase() == 'credit card') {
                  if ($scope.oldCreditMaestroDetected) return false;
                } else if ($scope.mode.toLowerCase() == 'debit card') {
                  if ($scope.oldDebitMaestroDetected) return false;
                }
                // Both should be dirty
                var check1 = form.cardM.$dirty && form.cardY.$dirty;
                var check2 = form.cardM.$valid;
                var check3 = form.cardY.$valid;
                var check4 = true; //form.cardY.$xblur && form.cardM.$xblur;
                var check5 = new Date() > new Date(form.cardY.$modelValue, form.cardM.$modelValue);

                if (check1) {
                  if (check4) {
                    if (check2 && check3) {
                      return check5;
                    } else return true;
                  } else return false
                } else return false;
              }
            case 'cardCVC':
              {
                if ($scope.mode.toLowerCase() == 'credit card') {
                  if ($scope.oldCreditMaestroDetected) return false;
                } else if ($scope.mode.toLowerCase() == 'debit card') {
                  if ($scope.oldDebitMaestroDetected) return false;
                }
                return form[element].$invalid && !form[element].$pristine && form[element].$xblur
              }
            case 'payment':
              return form.$invalid || $scope.validate('cardExp', form);
            case 'nb':
              return $scope.nb.netbanking;
            default:
              return false;
          }
        },
        validateMaestro: function() {
          if ($scope.mode.toLowerCase() == 'credit card') {
            var number = $scope.formname.cardNumber.$modelValue;
            if (('' + number).length === 19) {
              $scope.oldCreditMaestroDetected = true;
            } else {
              $scope.oldCreditMaestroDetected = false;
            }
          } else if ($scope.mode.toLowerCase() == 'debit card') {
            var number = $scope.formname.cardNumber.$modelValue;
            if (('' + number).length === 19) {
              $scope.oldDebitMaestroDetected = true;
            } else {
              $scope.oldDebitMaestroDetected = false;
            }
          }
        },
        getCCTypeImage: function(ccType) {
          if (!$scope.cardtypes[ccType]) return '';
          return $scope.cardtypes[ccType].img;
        },
        getPlaceOrderText: function() {
          if (!$scope.mode || !$scope.currency) return $sce.trustAsHtml('<span>LOADING...</span>');

          return $sce.trustAsHtml('PAY <span>' + Currency($scope.currency + '-white') + '	</span>' + $filter('number')($scope.amount) + '</span> SECURELY');
        }
      })
    }
  ]);
