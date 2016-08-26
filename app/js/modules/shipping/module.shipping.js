angular.module('shipping.services', []);
angular.module('shipping.controllers', ['shipping.services']);
angular.module('shipping.directives', []);

angular.module('module.shipping', [
  'shipping.controllers',
  'shipping.directives'
]);
