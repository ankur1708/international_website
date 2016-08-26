angular.module('core.filters')
.filter('highlight', ['$sce', function($sce) {
  return function(text, phrase) {
    if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
      '<strong class="tt-highlight">$1</strong>')

    return $sce.trustAsHtml(text)
  }
}]);
