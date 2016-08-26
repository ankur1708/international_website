angular.module('payment.services')
  .service('paymentHttpService', ['$http', function($http) {
    return {
      getPaymentMethods: function() {
        return $http.get( HOST + '/checkoutService/index/getPaymentMethods' );
      },
      placeOrder: function(json) {
        return $http({
          method: 'POST',
          url: HOST + '/checkoutService/index/placeOrderPrepaid',
          params: json
        });
      },
      placeOrderCOD: function(data) {
        return $http.post( HOST + '/checkoutService/index/placeOrderCOD', {
          data: data
        });
      },
      loadFinalQuote: function(platform, Authorization, XSession, customerId, quoteId, appVersion, imei) {
        if (platform === 'web') {
          return $http.get( HOST + '/checkoutService/index/loadFinalQuote' );
        } else {
          if (XSession)
            return $http.post( HOST + '/checkoutService/index/loadAppQuote', {
              "quoteId": quoteId,
              "XSession": XSession
            });
          else {
            return $http.post( HOST + '/checkoutService/index/loadAppQuote', {
              "quoteId": quoteId,
              "customerId": customerId,
              "Authorization": Authorization,
              "appVersion": appVersion,
              "imei": imei
            });
          }
        }
      },
      removeQuoteItems: function(productIds) {
        return $http.post( HOST + '/checkoutService/index/removeQuoteItems', {
          "productIds": productIds
        });
      }
    }
  }]);
