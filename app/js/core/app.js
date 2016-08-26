angular.module('core.config', ['oc.lazyLoad']);
angular.module('core.services', []);
angular.module('core.controllers', []);
angular.module('core.filters', []);
angular.module('core.directives', []);
angular.module('core.routes', ['ui.router']);
angular.module('app', [
  'core.config',
  'core.services',
  'core.controllers',
  'core.filters',
  'core.directives',
  'core.routes'
]);

Object.values = function(json) {
  var o = [];
  for (var key in json) {
    o.push(json[key])
  }
  return o;
}
angular.module('app')
.run(['$rootScope', '$location', function($rootScope, $location) {

  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.title) {
      $rootScope.pageTitle = toState.title;
    }

    var dataLayer = window.dataLayer || [];
    window.czURL = $location.absUrl();
  });
}]);

document.querySelector('.cv-loader').style.display = 'none';
