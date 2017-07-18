/*
 * Define main module.
 * Each sub-module (view) must be registered into the main module.
 */

angular.module('hosting', ['hosting.home', 'hosting.account', 'hosting.authentication', 'hosting.video', 'hosting.liveStream'])
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.hashPrefix('');
	}])

	.directive('menu', function ($cookies) {
		return {
			templateUrl: 'resources/views/header.html'
		};
	})
	.directive('logo', function ($cookies) {
		return {
			templateUrl: 'resources/views/logo.html'
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