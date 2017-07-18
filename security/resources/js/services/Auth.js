angular.module('911Video')

    .factory('AuthAPI', function ($http) {
        return {
            verifAuthentifie: function (callback) {
                const generalAPI = '/api/users';
                const current = '/current';
                const normalUserAPI = generalAPI + current;
                const securityUserAPI = generalAPI + '/securityUser' + current;

                var us = $http.get(normalUserAPI);
                var sus = $http.get(securityUserAPI);

                callback([us, sus]);

                //return (us === undefined) ? $http.get(securityUserAPI) : us;
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
            }
        };
    });