angular.module('cart.services', []);
angular.module('cart.controllers', ['cart.services']);
angular.module('cart.directives', []);

angular.module('module.cart', [
  'cart.controllers',
  'cart.directives'
]);
