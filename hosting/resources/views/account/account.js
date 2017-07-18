angular.module('hosting.account', ['ngRoute', 'hosting.services', 'hosting.prefs'])
    /*
     * Define routing and views for a creation of a home Account.
     */
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider
            .when("/signup", {
                templateUrl: "resources/views/account/createAccount.html",
                controller: "createAccountController"
            })
            .when("/edit", {
                templateUrl: "resources/views/account/editAccount.html",
                controller: "editAccountController"
            })
            .when("/live", {
                templateUrl: "resources/views/live.html",
                controller: "RemoteStreamsController"
            })
            .when("/signup-security", {
                templateUrl: "resources/views/account/createSecurityPersonAccount.html",
                controller: "securityPersonCtrl"
            });

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        //when("/{identifier}/account", {templateUrl: "resources/views/account/homeAccount.html", controller: "viewAccountController"});

    }])
    .controller('securityPersonCtrl', function ($scope, $rootScope, servicesAPI) {

        $scope.showSignupBox = true;


        servicesAPI.getCountries().then(function (data) {
            data = data.data;
            console.log("DATA", data);

            $scope.countries = data;

        }, function () {
            alert("Erreur chargement des pays");
        });

        servicesAPI.recupLangues().then(function (data) {
            data = data.data;
            console.log("Languages");
            console.log(data);
            $scope.langueList = data;
        }, function () {
            alert("Erreur chargement des langues");
        });


        $scope.getStates = function () {

            console.log(this, "Country");

            $scope.states = null;

            country = this.country;
            countryCode = country.countryCode;

            servicesAPI.getStates(countryCode).then(function (data) {
                data = data.data;
                console.log(data, "STATES");
                $scope.states = data.states;
            })



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


        $scope.securityType = [{
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
                name: "pour remorquage"
            }
        ];



        $scope.validatePasswords = function () {

            if ($scope.user.pwd != $scope.user.confirmationPw) {
                $scope.confNotValid = true;
                return;
            }

            $scope.confNotValid = false;


        }




        $scope.validateUser = function (user) {

            console.log($scope.user);

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
            $scope.user.country = $scope.country.countryCode;
            $scope.user.state = $scope.state.stateCode;

            console.log($scope.user);

            servicesAPI
                .createSecurityPerson($scope.user)
                .then(function (rs) {
                    console.log(rs);
                    alert("Le formulaire a été envoyé avec succès, on va se communiquer avec vous sous peu pour vous confirmer votre inscription merci!");
                    window.location = "/";

                }, function (err) {
                    console.log(err);
                    alert("error creating user");
                });


        }




    })
    .controller('createAccountController', function ($scope, $location, $cookies, servicesAPI) {

        // Object placeholder for form parameters.
        $scope.user = {};
        $scope.paysList = {};
        $scope.langueList = {};

        //Check if the user is deconnected to access the page of creation
        //This page must be only accessible if no session is active
        var cookie = $cookies.get("e-session");
        if (cookie) {
            $location.path("/home");
        } else {
            $scope.showSignupBox = true;
        }

        servicesAPI.recupLocalization().then(function (data) {
            data = data.data;
            $scope.paysList = data;
        }, function () {
            alert("Erreur chargement des pays");
        });

        servicesAPI.recupLangues().then(function (data) {
            data = data.data;
            $scope.langueList = data;
        }, function () {
            alert("Erreur chargement des langues");
        });

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

        $scope.isFormValid = function (formName) {

            var form = $scope[formName];

            if (!form) {
                return false;
            }

            return form.$valid;
        }

        $scope.validate = function (user) {
            //reinitialization of error message concerning required fields

            $scope.nameAlreadyUsed = false;
            $scope.mailAlreadyUsed = false;
            $scope.countryNotChosen = false;
            $scope.stateNotChosen = false;
            $scope.languageNotChosen = false;
            $scope.nameLenghtNotValid = false;
            $scope.pwLengthNotValid = false;
            $scope.addressLengthNotValid = false;
            $scope.creationPb = false;
            $scope.confNotValid = false;
            $scope.telFormatInvalid = false;
            $scope.telExamples = "";

            // We verify if the username contain between 8 and 20 characters
            if (user.name.length != 0 && (user.name.length < 8 || user.name.length > 20)) {
                $scope.nameLenghtNotValid = true;
                return;
            }
            //We check if the password length is valid
            if (user.password.length < 4 || user.password.length > 16) {
                $scope.pwLengthNotValid = true;
                return;
            }
            //We check if the two typed password are equal
            if (user.password != user.confirmationPw) {
                $scope.confNotValid = true;
                return;
            }

            //We check if the telephone format is valid
            var pattern = $scope.paysList[user.country].phonePattern;
            var phoneEntered = user.telephone;
            var res = phoneEntered.split(" ").join('')
            var re = new RegExp($scope.paysList[user.country].phonePattern)
            if (res.match(re) == null) {
                $scope.telExamples = $scope.paysList[user.country].phoneExamples;
                $scope.telFormatInvalid = true;
                return;
            }

            //We check if the address length is valid
            if (user.address.length > 100) {
                $scope.addressLengthNotValid = true;
                return;
            }
            //Verifi if the country is selected
            if (user.country == undefined) {
                $scope.countryNotChosen = true;
                return;
            }
            //Verify if the state is selected
            if (user.state == undefined) {
                $scope.stateNotChosen = true;
                return;
            }
            //Verify if the language is selected
            if (user.language == undefined) {
                $scope.languageNotChosen = true;
                return;
            }

            //if the international indicatif of the phone, we add it in the registration in the DB
            var tel = "";
            if (res.match(re)[1] != $scope.paysList[user.country].indicatif) {
                tel = $scope.paysList[user.country].indicatif + res.match(re)[2];
            } else {
                tel = res;
            }

            // Case of a subscription without username
            if (user.name == undefined || user.name.length == 0) {


                servicesAPI.createHomeAccountName( //For the moment, we have to put the email for the username in that case
                        user.email,
                        user.password,
                        user.email,
                        user.firstname,
                        user.lastname,
                        tel,
                        user.address,
                        user.city,
                        user.country,
                        user.state,
                        user.language)
                    .then(function () {
                        $location.path("/");

                    }, function () {
                        $scope.creationPb = true;
                    })

            } else { //Case of a subscription with a username

                servicesAPI.createHomeAccountName(
                        user.name,
                        user.password,
                        user.email,
                        user.firstname,
                        user.lastname,
                        tel,
                        user.address,
                        user.city,
                        user.country,
                        user.state,
                        user.language)
                    .then(function () {
                        $location.path("/");

                    }, function () {
                        $scope.creationPb = true;
                    })


            }
        };
    })
    .controller('editAccountController', function ($scope, $location, $cookies, servicesAPI, prefLoader) {

        // Object placeholder for form parameters.
        $scope.user = {};
        $scope.paysList = {};
        $scope.langueList = {};

        servicesAPI.recupLocalization().then(function (data) {
            data = data.data;
            $scope.paysList = data;
        }, function () {
            alert("Erreur chargement des pays");
        });

        $scope.selectLanguage = function (lang) {
            prefLoader.changeLanguage(lang).then(
                function (resp) {
                    $scope.userLanguageMenuOptions = resp.data.header_menu_options;
                    $scope.userLanguageAccountFields = resp.data.edit_account_fields;
                },
                function (err) {
                    console.log(err);
                }
            );
        };

        prefLoader.getLanguage().then(
            function (resp) {
                $scope.userLanguageMenuOptions = resp.data.header_menu_options;
                $scope.userLanguageAccountFields = resp.data.edit_account_fields;
            },
            function (err) {
                console.log(err);
            }
        );

        servicesAPI.recupLangues().then(function (data) {
            data = data.data;
            $scope.langueList = data;
        }, function () {
            alert("Erreur chargement des langues");
        });

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

        servicesAPI.verifAuthentifie().then(function (data) {
            data = data.data;
            //We suppress the space at the end of the returned state_abbreviation
            data = data.user;
            var etat = data.localization.state_abbreviation.split(" ")[0];
            //We fill the fields with the retrieved informations (city is hardcoded for the moment)
            $scope.user = {
                name: data.username,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                telephone: data.phone,
                address: data.localization.street,
                city: data.localization.city,
                country: data.localization.country_fips,
                state: etat,
                language: data.language_code
            };

            $scope.m4nAccess = data.media_agent === undefined ? false : true;
        });

        $scope.validate = function (user) {
            //reinitialization of error message concerning required fields

            $scope.nameAlreadyUsed = false;
            $scope.mailAlreadyUsed = false;
            $scope.countryNotChosen = false;
            $scope.stateNotChosen = false;
            $scope.languageNotChosen = false;
            $scope.nameLenghtNotValid = false;
            $scope.modificationPb = false;
            $scope.addressLengthNotValid = false;
            $scope.telFormatInvalid = false;
            $scope.telExamples = "";

            // We verify if the username contain between 8 and 20 characters
            if (user.name.length != 0 && (user.name.length < 8 || user.name.length > 20)) {
                $scope.nameLenghtNotValid = true;
                return;
            }
            //We check if the telephone format is valid
            //N.B: for  french cell phones, numbers start with 06 or 07 (+336 or +337 with the international indicator)
            //As the attribute in the Person Table is called "cell_phone_number" in the DB, only cell phones are accepted
            //for a french user
            var pattern = $scope.paysList[user.country].phonePattern;
            var phoneEntered = user.telephone;

            var tel = phoneEntered.split(" ").join('')

            var re = new RegExp($scope.paysList[user.country].phonePattern)
            if (tel.match(re) == null) {
                $scope.telExamples = $scope.paysList[user.country].phoneExamples;
                $scope.telFormatInvalid = true;
                return;
            }

            //We check if the address length is valid
            if (user.address.length > 100) {
                $scope.addressLengthNotValid = true;
                return;
            }

            //We verifiy if the country is selected
            if (user.country == undefined) {
                $scope.countryNotChosen = true;
                return;
            }
            //Verify if the state is selected
            if (user.state == undefined) {
                $scope.stateNotChosen = true;
                return;
            }
            //Verify if the language is selected
            if (user.language == undefined) {
                $scope.languageNotChosen = true;
                return;
            }

            // Case of a subscription without username
            if (user.name == undefined || user.name.length == 0) {


                servicesAPI.editAccount( //For the moment, we have to put the email for the username in that case
                        user.email,
                        user.email,
                        user.firstname,
                        user.lastname,
                        tel,
                        user.address,
                        user.city,
                        user.country,
                        user.state,
                        user.language)
                    .then(function () {
                        $cookies.put("modifOk", "1");
                        $location.path("/");

                    }, function () {
                        $scope.modificationPb = true;
                    });


            } else {

                servicesAPI.editAccount(
                        user.name,
                        user.email,
                        user.firstname,
                        user.lastname,
                        tel,
                        user.address,
                        user.city,
                        user.country,
                        user.state,
                        user.language)
                    .then(function () {
                        $cookies.put("modifOk", "1");
                        $location.path("/");

                    }, function () {
                        $scope.modificationPb = true;
                    })


            }

        };
    })
    .controller('viewAccountController', function ($scope, servicesAPI) {});