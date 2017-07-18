/*
 * Define main module.
 * Each sub-module (view) must be registered into the main module.
 */

var m4nModule = angular.module('money4news', ['angular-svg-round-progressbar', 'money4news.homeMedia', 'ui.materialize', 'ngCookies', 'ds.clock'])
  .directive('menu', function () {
    return {
      templateUrl: 'resources/views/header.html'
    };
  })
  .directive('side-menu', function () {
    return {
      templateUrl: 'resources/views/side.html'
    };
  })
  .directive('starRating', function () {
    return {
      restrict: 'EA',
      template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function (scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 10;
        }

        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function (index) {
          if (scope.readonly == undefined || scope.readonly === false) {
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function (oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  })
  .directive('onErrorSrc', function () {
    return {
      link: function (scope, element, attrs) {
        element.bind('error', function () {
          if (attrs.src != attrs.onErrorSrc) {
            attrs.$set('src', attrs.onErrorSrc);
          }
        });
      }
    }
  });