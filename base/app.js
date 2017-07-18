/*
 * Define main module.
 * Each sub-module (view) must be registered into the main module.
 */

var home = angular.module('base',
	['base.home', 'base.authentication']);

home.run(function($config, $rootScope){


	var local = window.navigator.language || navigator.browserLanguage;

	if(local.split("-").length > 1)
		local = local.split("-")[0];

	console.log($config.default_local, "$config local default");
	console.log(local, "browser language");

	if(!window.locals[ $config.default_local ]){
		alert("No default local provided. Please create a default local and try run again the app")
		throw "No default local provided. Please create a default local and try run again the app";
	}

	$rootScope.local = window.locals[ local ] ? window.locals[ local ] : window.locals[ $config.default_local ];

})

home.directive('footer', function() {
	return {
		templateUrl: 'resources/views/footer.html'
	};
});
