angular.module('core.routes')
  .config([
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    '$controllerProvider',

    function($stateProvider, $locationProvider, $urlRouterProvider, $controllerProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
      function loader(name) {
        return ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load(name);
        }]
      }

      $stateProvider
        .state('login', {
          url: "/buy/login",
          templateUrl: 'partials/login.html',
          controller: 'loginCtrl',
          title: 'Login',
          authenticate: false,
          resolve: loader('js/dist/cart.min.js')
        })
        .state('shipping', {
          url: "/buy/shipping",
          templateUrl: 'partials/shipping.html',
          controller: 'shippingCtrl',
          title: 'Shipping',
          authenticate: true,
          resolve: loader('js/dist/cart.min.js')
        })
        .state('payment', {
          url: "/buy/payment?error",
          templateUrl: 'partials/payment.html',
          controller: 'paymentCtrl',
          title: 'Payment',
          authenticate: false,
          resolve: loader('js/dist/payment.min.js')
        })
        .state('payments-success', {
          url: "/buy/payment-success/:platform",
          cache: false,
          templateUrl: 'partials/payment-success.html',
          controller: 'paymentSuccessCtrl',
          title: 'Success',
          authenticate: false,
          resolve: loader('js/dist/payment-success.min.js')
        })
        .state('cart', {
          url: "/buy/cart",
          templateUrl: 'partials/checkout-cart.html',
          controller: 'checkoutCartCtrl',
          title: 'Shopping Cart',
          authenticate: false,
          resolve: loader('js/dist/cart.min.js')
        });
      $urlRouterProvider.otherwise("/buy/cart");
    }
  ]);
