angular.module('core.controllers')
.controller('ctrl.main', [
	'$scope',
	'$rootScope',
	'$window',
	'$timeout',
	'$sce',
  '$state',

	'ENVIRONMENT',
	'ENV_DEV',
	'ENV_PROD',

  'coreHttpService',

	function ($scope, $rootScope, $window, $timeout, $sce, $state, ENVIRONMENT, ENV_DEV, ENV_PROD, coreHttpService) {

    if(ENVIRONMENT == 'development') {
      angular.extend($rootScope, ENV_DEV);
    }
    if(ENVIRONMENT == 'production') {
      angular.extend($rootScope, ENV_PROD);
    }

    angular.extend($rootScope, {
      getScript: function (host, path) {
				return host + path;
			},
      goBack: function () {
				$timeout(function () {
						$window.history.back();
				}, 1000);
      },
      scrollToTop: function () {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    });

    angular.extend($scope, {
      currentView: function (){
        return $state.current.title;
      },
      getProductMetaData: function(){
      	var obj = arguments[0];
      	var returnArr = [];
      	for(var i = 1; i < arguments.length; i++){
      		if(typeof obj[arguments[i].key] !== typeof undefined)
      			returnArr.push('<span class="meta-label">' + arguments[i].name + '</span> <span class="meta-value">' + obj[arguments[i].key]) + '</span>'
      	}
      	return $sce.trustAsHtml(returnArr.join('<span class="pipe">&nbsp;&nbsp;|&nbsp;&nbsp;</span>'));
      },
      checkLogin: function () {
        coreHttpService.loginCheck()
        .success(function(response) {
          if(response.s == 1) {
            window.czuser= response.d;
            $scope.isLoggedIn = true;
          } else {
            $scope.isLoggedIn = false;
          }
        })
        .error(function (error) {
          throw new Error(error);
        });
      }
    });

		$rootScope.isAndroid = typeof Android !== typeof undefined;
    $rootScope.platform = $rootScope.isAndroid ? "app" : "web";

    // initGTM($rootScope.GTM_ID);
}]);

function initGTM(ID, callback) {
  window.gtmInitStarted = true;
	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                '//www.googletagmanager.com/gtm.js?id='+i+dl;j.onload=callback;f.parentNode.insertBefore(j,f);
        }(window,document,'script','dataLayer', ID));
}
