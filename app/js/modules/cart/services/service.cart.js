angular.module('cart.services')
  .service('cartHttpService', ['$http', function($http) {
    return {
      updateQty: function (productId, productQty) {
        return $http.post( HOST + '/checkoutService/index/updateQty', {
          "productId": productId,
          "productQty": productQty
        });
      },
      addToQuote: function (productId, qty) {
        return $http.post( HOST + '/checkoutService/index/addToQuote', {
          "productId": productId,
          "qty": qty
        });
      },
      removeQuoteItems: function (productIds) {
        return $http.post( HOST + '/checkoutService/index/removeQuoteItems', {
          "productIds": productIds
        });
      },
      addNoteToSeller: function (productId, comment) {
        return $http.post( HOST + '/checkoutService/index/addNoteToSeller', {
          "productId": productId,
          "comment": comment
        });
      },
      updateNoteToSeller: function (productId, comment) {
        return $http.post( HOST + '/checkoutService/index/updateNoteToSeller', {
          "productId": productId,
          "comment": comment
        });
      },
      removeNoteToSeller: function (productId) {
        return $http.post( HOST + '/checkoutService/index/removeNoteToSeller', {
          "productId": productId
        });
      },
      applyCoupon: function (couponCode) {
        return $http.post( HOST + '/checkoutService/index/applyCoupon', {
          "couponCode": couponCode
        });
      },
      removeCoupon: function (couponCode) {
        return $http.post( HOST + '/checkoutService/index/removeCoupon', {
          "couponCode": couponCode
        });
      },
      loadAutoComplete: function (keyword) {
        return $http.get( HOST + '/v1/getAutosuggestion?term=' + keyword );
      }
    }
  }]);
