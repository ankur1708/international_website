angular.module('paymentsuccess.services')
  .service('paymentsuccessHttpService', ['$http', function($http) {
    return {
      getOrderDetails: function() {
        return $http.get( HOST + '/checkoutService/index/orderDetails' );
      },
      sendAffiliateData: function(timestamp, affiliateName, orderId, orderValue, utmMedium) {
        return $http.post( HOST + '/checkoutService/index/saveAffiliate', {
          date_timestamp: timestamp,
          affiliate_name: affiliateName,
          order_id: orderId,
          order_value: orderValue,
          utm_medium: utmMedium
        });
      },
      getTailorvillaDetails: function(encodedData) {
        return $http({
          method: 'GET',
          url: 'https://tailorvilla.com/api/stitching_offer/'.concat(encodedData),
          withCredentials: false
        })
      }
    }
  }]);
