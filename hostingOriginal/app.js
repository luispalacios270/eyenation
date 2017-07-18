/*
 * Define main module.
 * Each sub-module (view) must be registered into the main module.
 */

angular.module('hosting', 
	['hosting.home','hosting.account','hosting.authentication', 'hosting.video', 'hosting.liveStream'])
	
	.directive('menu', function($cookies) {
		return {
		  templateUrl: 'resources/views/header.html'
		};
	})
	.directive('logo', function($cookies) {
		return {
		  templateUrl: 'resources/views/logo.html'
		};
	})
;