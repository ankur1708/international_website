angular.module('login.config')
.config(['$authProvider', function ($authProvider) {
  $authProvider.baseUrl = HOST;
  $authProvider.withCredentials = true;

  $authProvider.facebook({
    clientId: '1668947976707075',
    responseType: 'token',
    url: '/checkoutService/index/socialLogin',
    skipAuthorization: true,
  });

  $authProvider.google({
    clientId: '284180597119-51glidbrmd6u9lg77hjvqhbq69vl62j9.apps.googleusercontent.com',
    url: '/checkoutService/index/socialLogin',
    skipAuthorization: true,
    redirectUri: window.location.origin ? window.location.origin + '/buy/login' : window.location.protocol + '//' + window.location.host + '/buy/login',
  });
}])
