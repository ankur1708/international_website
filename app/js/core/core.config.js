angular.module('core.config')
  .constant('VERSION', '0.0.1')
  .constant('ENV_PROD', {
    'PRODUCTURL': 'http://www.craftsvilla.com/catalog/product/view/id/',
    'HOST': 'https://securestatic.craftsvilla.com',
    'NSHOST': 'http://www.craftsvilla.com',
    'IMGHOST': 'https://secureimg1.craftsvilla.com',
    'LSTATIC': 'https://securelstatic1.craftsvilla.com/',
    'GTM_ID': 'GTM-5W7X48'
  })
  .constant('ENV_DEV', {
    'PRODUCTURL': 'https://securedev' + env_id + '.craftsvilla.com/catalog/product/view/id/',
    'HOST': 'https://securedev' + env_id + '.craftsvilla.com',
    'NSHOST': 'http://dev' + env_id + '.craftsvilla.com',
    'IMGHOST': 'https://secureimg1.craftsvilla.com',
    'LSTATIC': 'https://securelstatic1.craftsvilla.com/',
    'GTM_ID': 'GTM-NZFVN6'
  })
  //.constant('ENVIRONMENT', 'production')
  .constant('ENVIRONMENT', 'development')
  .constant('VIEWS', {
    footer: 'partials/footer.html'
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])
  .config(['ENVIRONMENT', 'ENV_DEV', 'ENV_PROD', function(ENVIRONMENT, ENV_DEV, ENV_PROD) {
    if (ENVIRONMENT == 'development') {
      window.HOST = ENV_DEV.HOST;
    }
    if (ENVIRONMENT == 'production') {
      window.HOST = ENV_PROD.HOST;
    }
  }])
  .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
      debug: false
    });
  }]);
