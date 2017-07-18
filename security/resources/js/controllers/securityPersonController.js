angular.module('911Video')

    .controller('securityPersonCtrl', function ($scope, $rootScope, servicesAPI) {


        servicesAPI.getCountries().then(function (data) {
            data = data.data;
            console.log("DATA", data);
            $scope.countries = data;

        }, function () {
            alert("Erreur chargement des pays");
        });

        servicesAPI.recupLangues().then(function (data) {
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

            servicesAPI.getStates($scope.country).
            then(function (data) {
                /*console.log(data);*/
                data = data.data;
                console.log(data, "STATES");
                $scope.states = data.states;
            });



        }

        $scope.getStatesByCurrentCountry = function () {
            // Validate if current country is set.
            if (!$scope.user.country) {
                return [];
            }

            var country = $scope.paysList[$scope.user.country];

            // Check if chosen country exists or has states.
            if (!country || !country.states) {
                return [];
            }

            // Return country states
            return country.states;
        }


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



        $scope.validatePasswords = function () {            
            console.log($scope.user.pwd);
            console.log($scope.user.confirmationPw);

            if ($scope.user.pwd != $scope.user.confirmationPw) {
                $scope.confNotValid = true;
                return;
            } else {
                $scope.confNotValid = false;
                return;
            }
        };




        $scope.validateUser = function (user) {

            // We verify if the username contain between 8 and 20 characters
            if (user.username.length != 0 && (user.username.length < 8 || user.username.length > 20)) {
                $scope.nameLenghtNotValid = true;
                return;
            }
            //We check if the password length is valid
            if (user.pwd.length < 4 || user.pwd.length > 16) {
                $scope.pwLengthNotValid = true;
                return;
            }
            //We check if the two typed password are equal
            if (user.pwd != user.confirmationPw) {
                $scope.confNotValid = true;
                return;
            }

            if (!$scope.securityType) {
                $scope.invalidSecurityType = true;
                return;
            }


            /*

                //validating form fields

                    for(x in $scope.user)
                    {
                        if($scope.user[x] === null)
                           { $scope.securityPerson[x].$setValidity(x, false);}

                    }

                    if($scope.securityPerson.$invalid)
                        return;

                    */


            $scope.user.securityType = $scope.securityType.value;
            $scope.user.country = $scope.country ? $scope.country.countryCode : null;
            $scope.user.state = $scope.state ? $scope.state.stateCode : null;



            servicesAPI
                .createSecurityPerson($scope.user)
                .then(function (rs) {
                    rs = rs.data;
                    console.log(rs);
                    bootbox.alert("Le formulaire a été envoyé avec succès, on va se communiquer avec vous sous peu pour vous confirmer votre inscription merci!");
                    window.location = "/security/#/seConnecterPolice";

                }, function (err) {
                    console.log(err);
                    bootbox.alert("error creating user");
                });


        }




    })