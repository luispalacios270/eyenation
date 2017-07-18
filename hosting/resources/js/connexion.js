var webEyeNation=angular.module('webEyeNation',[]);


webEyeNation.controller("sessionActiveCtrl",function($scope,$http){
	$scope.showAuth=false;
	$http.get("http://localhost:3000/api/users/current").
	success(function(status){
		if(status==200){
			$window.location.href="futurePage.html";
		}
	}).
	error(function(){
		alert("azer");
		$scope.showAuth=true;
		alert("bte");
	});
});