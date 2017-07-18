//vFromNumberController.js

angular.module('base').controller('vFromNumberController', vFromNumberController);


function vFromNumberController($scope, $rootScope, $config, $APIvFromNumber, $validations){

	 $('[data-toggle="popover"]').popover({trigger : "hover"}); 


	$scope.getVideoFromNumber = function(){


	 if($validations.phone($scope.telNumber))
		$APIvFromNumber
		.get($scope.telNumber)
		.success(function(rs, code){

			console.log(rs);
			window.location = "/911videos/#/video/" + JSON.stringify(rs);

		})
		.error(function(err, code){

			if(code === 404)
				alert("No video to show from this number");

			console.log(err, code, "API error");
			throw "API error";

		})
	  else
	  	alert("You need enter a valid phone number");

	}


}