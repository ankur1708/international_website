angular.module('payment.services', []);
angular.module('payment.controllers', ['payment.services', 'ngCookies']);
angular.module('payment.directives', []);

angular.module('module.payment', [
  'credit-cards',
  'payment.controllers',
  'payment.directives'
]);
