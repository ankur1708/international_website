angular.module('login.config', ['satellizer']);
angular.module('login.services', []);
angular.module('login.controllers', ['login.services']);

angular.module('module.login', [
  'login.controllers'
]);
