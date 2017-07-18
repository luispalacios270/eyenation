//mainController.js

angular.module("911Video")
    .controller("mainCtrl", mainCtrl);

var baseCoors = "46.829853,-71.254028";


function mainCtrl($scope, $rootScope, $cookies, $state, $window, NgMap, $http, GEOLOCATE_PATH, GEOLOCATE_KEY, APIuser, $mdDialog) {
    $scope.securityTypes = [{
            value: 1,
            name: "pour centrale 911"
        },
        {
            value: 2,
            name: "pour pompier"
        },
        {
            value: 3,
            name: "pour police"
        },
        {
            value: 4,
            name: "pour ambulancier"
        },
        {
            value: 5,
            name: "pour hôpital"
        },
        {
            value: 6,
            name: "pour médecin"
        },
        {
            value: 7,
            name: "pour remorquage"
        }
    ];

    APIuser.getSecurityUser().then(function (data) {
        data = data.data;
        console.log("USER", data);
        $scope.user = data;
    })

    APIuser.getCountries().then(function (data) {
        data = data.data;
        console.log("DATA", data);
        $scope.countries = data;

    }, function () {
        alert("Erreur chargement des pays");
    });

    APIuser.recupLangues().then(function (data) {
        data = data.data;
        $scope.langueList = data;
    }, function () {
        alert("Erreur chargement des langues");
    });


    $scope.getStates = function () {

        // console.log(this, "Country");
        $scope.states = null;
        /*country = this.country;*/
        /*countryCode = country.countryCode;*/

        APIuser.getStates($scope.user.country).
        then(function (data) {
            /*console.log(data);*/
            data = data.data;
            console.log(data, "STATES");
            $scope.states = data.states;
        });



    }


    if (!window.localStorage.user) {


    }

    //getting user current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {


            $rootScope.userLocation = position.coords.latitude + "," + position.coords.longitude;

            $rootScope.$broadcast('geolocation', $rootScope.userLocation)

            console.log($rootScope.userLocation);

        }, function () {


            $http({
                    method: 'POST',
                    url: GEOLOCATE_PATH + GEOLOCATE_KEY
                })
                .then(function (res) {

                    $rootScope.userLocation = res.data.location.lat + "," + res.data.location.lng;

                    $rootScope.$broadcast('geolocation', $rootScope.userLocation);

                })
                .catch(function (err) {

                    $rootScope.userLocation = baseCoors;

                    $rootScope.$broadcast('geolocation', $rootScope.userLocation);

                    console.log("BY HERE")

                })





            // NgMap.initMap('Map');
        });
    }


    $scope.logout = function () {

        $cookies.remove("e-session", {
            path: "/"
        });
        window.localStorage.removeItem("user");
        console.log(window.location);
        // window.location.href = "http://"+window.location.hostname;        
        window.location.pathname = "/security/"

    }

    $scope.windowHeight = angular.element($window).height();

    $scope.changePassword = function () {
        $('#changePassword').modal('show');
    }

    $scope.showPrerenderedDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#passwordModal',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    $scope.editPerfil = function (ev) {
        $mdDialog.show({
            contentElement: '#editUser',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    $scope.submitResetForm = function () {
        APIuser.passwordReset($scope.resetForm).then(function (response, code) {
            console.log(code)
            if (code == 200) {
                alert("Password changed successful");
                $('#changePassword').modal('hide');
                delete $scope.resetForm;
                $mdDialog.hide();
            } else {
                alert("We can not change your password. Please veirify that you are entering the correct password or contact to support center");
            }
            console.log(response);
        }, function (error, code) {
            alert("We can not change your password. Please veirify that you are entering the correct password or contact to support center");
        });
    }

}