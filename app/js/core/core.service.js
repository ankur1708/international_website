angular.module('core.services')
.service('coreHttpService', ['$http', function ($http) {
  return {
    loginCheck: function() {
      return $http.get( HOST + '/checkoutService/index/loginCheck' );
    },
    loadQuote: function () {
      return $http.get( HOST + '/checkoutService/index/loadQuote' );
    },
  }
}])
.service('ErrorMessages', [function() {
  return {
    cart: {
      removeQuoteItems: 'Unable to remove product from cart. Please try again.',
      addNoteToSeller: 'Failed to add note to seller. Please try again.',
      removeNoteToSeller: 'Failed to remove note. Please try again.',
      updateQty: 'The requested quantity is not available.',
      addToQuote: 'Failed to undo. Product is now out of stock',
      proceedToCheckout: "Please remove out of stock products.",
    },
    login: {
      forgotPassword: 'This email is not registered with us. You can still proceed using Guest Checkout.',
      socialAuth: 'Login failure. Please try again.'
    },
    payment: {
      placeOrder: 'Unable to place order. Please try again.',
      errors: {
        nonCod: "Sorry, your payment could not be processed. Please try again",
        cod: "Having trouble with your payments? Pay via CASH ON DELIVERY"
      }
    },
    shipping: {
      getCountry: 'Network connectivity failure. Please try again.',
      addAddress: 'Failed to add address. Please check your form entries or try refreshing the page',
      updateAddress: 'Failed to update address. Please check your form entries or try refreshing the page',
    }
  }
}])
.service('Currency', ['$sce', function($sce) {
  return function(currencyCode, mode) {
    currencyCode = currencyCode || 'INR';
    var currencies = {
      "AUD": {
        prefix: "AU",
        cssClass: "sprite sprite-usd"
      },
      "AUD-white": {
        prefix: "AU",
        cssClass: "sprite sprite-usd-white"
      },
      "GBP": {
        prefix: "",
        cssClass: "sprite sprite-gbp"
      },
      "GBP-white": {
        prefix: "",
        cssClass: "sprite sprite-gbp-white"
      },
      "CAD": {
        prefix: "CA",
        cssClass: "sprite sprite-usd"
      },
      "CAD-white": {
        prefix: "CA",
        cssClass: "sprite sprite-usd-white"
      },
      "EUR": {
        prefix: "",
        cssClass: "sprite sprite-eur"
      },
      "EUR": {
        prefix: "",
        cssClass: "sprite sprite-eur-white"
      },
      "EUR-white": {
        prefix: "",
        cssClass: "sprite sprite-eur-white"
      },
      "INR": {
        prefix: "",
        cssClass: "sprite sprite-inr"
      },
      "INR-white": {
        prefix: "",
        cssClass: "sprite sprite-inr-white"
      },
      "MYR": {
        prefix: "RM",
        cssClass: ""
      },
      "MYR-white": {
        prefix: "RM",
        cssClass: ""
      },
      "SGD": {
        prefix: "S",
        cssClass: "sprite sprite-usd"
      },
      "SGD-white": {
        prefix: "S",
        cssClass: "sprite sprite-usd-white"
      },
      "USD": {
        prefix: "",
        cssClass: "sprite sprite-usd"
      },
      "USD-white": {
        prefix: "",
        cssClass: "sprite sprite-usd-white"
      },

    }
    var currency = currencies[currencyCode];

    if (mode === 'text')
      return currency.prefix + '<i class="' + currency.cssClass + '"> </i>';

    return $sce.trustAsHtml(currency.prefix + '<i class="' + currency.cssClass + '"> </i>');
  }
}]);
