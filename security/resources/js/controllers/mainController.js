//mainController.js

angular.module("911Video")
	.controller("mainCtrl", mainCtrl);

function mainCtrl($scope, $rootScope, $cookies, $state, APIuser) {

	//getting user current location



	$scope.logout = function () {

		$cookies.remove("e-session", {
			path: "/"
		});

		window.localStorage.removeItem("user");

		window.location = "/security";

	}


}