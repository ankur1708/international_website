angular.module('login.services')
  .service('loginHttpService', ['$http', function($http) {
    return {
      getLogin: function(emailId, password) {
        return $http.post( HOST + '/checkoutService/index/getLogin', {
          "emailId": emailId,
          "password": password
        });
      },
      forgotPassword: function(emailId) {
        return $http.post( HOST + '/checkoutService/index/forgotPassword', {
          "emailId": emailId
        });
      },
      continueAsGuest: function(emailId) {
        return $http.post( HOST + '/checkoutService/index/continueAsGuest', {
          "customerEmail": emailId
        });
      },
      socialAuth: function(json) {
        return $http({
          method: 'POST',
          url: HOST + '/checkoutService/index/socialLogin',
          data: json,
          withCredentials: true
        });
      }
    }
  }]);
