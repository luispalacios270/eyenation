var video911App = (function (angular) {

    "use strict";

    var app = {};

    app = angular.module('911Video', ['ngRoute', 'ngCookies', 'ui.router', 'ngMap', 'slick', , 'ngMaterial',
        'ngMessages',
        'ngAnimate'
    ]);

    app.constant('API_BASE', "/api/");
    app.constant('VIDEOS_BASE', "http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/")
    app.constant('GEOLOCATE_PATH', "https://www.googleapis.com/geolocation/v1/geolocate?key=")
    app.constant('GEOLOCATE_KEY', "AIzaSyA1UObSXVw_x9ElENmFJH_o64wVy9UPFoc")
    app.constant('SOCKET_URL', "http://webrtcfast.herokuapp.com:80/")

    app.run(["$window", "SOCKET_URL", function ($window, SOCKET_URL) {
        $window.socket = io.connect(SOCKET_URL);
    }]);

    app.config(function ($stateProvider, $urlRouterProvider, $compileProvider, $sceDelegateProvider, VIDEOS_BASE) {


        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            VIDEOS_BASE + '/**'
        ]);


        /**
		$routeProvider.when('/', { templateUrl: "resources/views/main.html", controller: "video911Controller" });
		$routeProvider.when('/:id', { templateUrl: "resources/views/main-datail.html", controller: "videoViewingController" });

		*/

        // Optimize load start with remove binding information inside the DOM element
        $compileProvider.debugInfoEnabled(true);
        // Set default state
        $urlRouterProvider.otherwise('/');
        $stateProvider

            .state('/', {
                url: '/',
                templateUrl: "resources/views/main.html",
                controller: "video911Controller",
                data: {
                    pageTitle: '911 videos'
                }
            })
            // 911 video details
            .state('video911', {
                url: "/video/:id/:lat/:lng",
                controller: "videoViewingController",
                templateUrl: "resources/views/main-datail.html",
                data: {
                    pageTitle: '911 video details'
                },
                params: {
                    video: null,
                    fromNumber: null
                }
            })


            // 911 video details
            .state('user-profile', {
                url: "/user-profile",
                controller: "profileCtrl",
                templateUrl: "resources/views/edit_profile_security.html",
                data: {
                    pageTitle: '911 profile'
                }
            })

    });

    app.directive('header', function () {
        return {
            templateUrl: 'resources/views/header.html',
            controller: function ($scope, $state) {

                $scope.state = $state.params;

                $scope.user = localStorage.user ? JSON.parse(window.localStorage.user) : null
                console.log($scope.user);


            }
        };
    })

    app.directive('appFooter', function () {
        return {
            templateUrl: 'resources/views/footer.html',
            controller: function ($scope, $state) {

                $scope.today = new Date();

            }
        };
    })

    app.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);

    app.service('LoadingInterceptor', ['$q', '$rootScope', '$log',
        function ($q, $rootScope, $log) {
            'use strict';

            return {
                request: function (config) {
                    $rootScope.loading = true;
                    return config;
                },
                requestError: function (rejection) {
                    $rootScope.loading = false;
                    $log.error('Request error:', rejection);
                    return $q.reject(rejection);
                },
                response: function (response) {
                    $rootScope.loading = false;
                    return response;
                },
                responseError: function (rejection) {
                    $rootScope.loading = false;
                    $log.error('Response error:', rejection);
                    return $q.reject(rejection);
                }
            };
        }
    ])



    return app;

})(angular);