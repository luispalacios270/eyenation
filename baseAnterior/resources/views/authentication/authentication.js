    angular.module('base.authentication', ['ngRoute', 'ngCookies', 'base.services'])
        /*
         * Define routing and views.
         */
        /*.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.
            when("/login", {
                templateUrl: "resources/views/home/home.html",
                controller: "homeController"
            });
        }])*/
        .controller('authenticationController', function ($scope, servicesAPI, $cookies) {

            $scope.user = {};
            $scope.validateLoginFor = function (user) {

                var xAuthType;
                if (user.name && user.pwd)
                    xAuthType = 0; //user.name.indexOf("@") !== -1 ? "1" : "0" ;
                else
                    return;

                var connectString = btoa(user.name + ':' + user.pwd);

                servicesAPI.authenticate(connectString, xAuthType).then(function (user) {
                    if (user !== undefined) {
                        // location.href = '/hosting';
                        location.href = '/hosting/#/videoViewer';
                    }
                }, function (err) {
                    console.log(err);
                    $("#err").css('display', 'block');
                });
            };
            if ($cookies.get("e-session")) {
                servicesAPI.verifAuthentifie(function (call) {

                    call.success(function (resp) {
                        if (resp !== undefined && resp.localization)
                            location.href = '/hosting';
                    });
                });
            }
        });