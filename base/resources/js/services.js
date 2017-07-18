angular.module('base.services', [])
    .factory('servicesAPI', function ($http) {
        return {
            verifAuthentifie: function (callback) {
                const API = '/api/users/current';

                callback($http.get(API));
            },
            authenticate: function (connectString, xAuthType) {
                return $http({
                    method: 'POST',
                    url: '/api/auth',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        "x-auth": "rG8x*Cp " + connectString,
                        "x-auth-type": xAuthType
                    }
                });
            },
            securityCheck: function () {
                console.log("S-CHECK");
            },
            recupLocalization: function () {
                return $http.get("vendors/localization/countries.json");
            },
            recupLangues: function () {
                return $http.get("vendors/localization/languagesList.json");
            },
            getCountries: function () {
                return $http({
                    withCredentials: true,
                    method: 'GET',
                    url: '/api/country/all',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            },
            getStates: function (data) {
                return $http({
                    withCredentials: true,
                    method: 'GET',
                    url: '/api/country/' + data + '/states',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            },
            createHomeAccountName: function (username, pwd, email, firstname, lastname, telephone, address, city, country, state, language) {
                return $http({
                    method: 'POST',
                    url: '/api/users/',
                    data: {
                        'username': username,
                        'pwd': pwd,
                        'email': email,
                        'firstname': firstname,
                        'lastname': lastname,
                        'telephone': telephone,
                        'address': address,
                        'city': city,
                        'country': country,
                        'state': state,
                        'language': language
                    },
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            },
            createHomeAccountWithoutName: function (pwd, email, firstname, lastname, telephone, address, city, country, state, language) {
                return $http({
                    method: 'POST',
                    url: '/api/users/',
                    data: {
                        'pwd': pwd,
                        'email': email,
                        'firstname': firstname,
                        'lastname': lastname,
                        'telephone': telephone,
                        'address': address,
                        'city': city,
                        'country': country,
                        'state': state,
                        'language': language
                    },
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            }
        };
    });