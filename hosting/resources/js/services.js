angular.module('hosting.services', [])
  .factory('servicesAPI', function ($http) {
    return {
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
      createSecurityPerson: function (data) {
        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/users/securityUser',
          data: data,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      verifAuthentifie: function () {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/users/current',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      infoVideo: function () {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/users/current/videos',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      editVideo: function (uniqueName, description, nomvideo, category) {
        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/videos/' + uniqueName,
          data: {
            'unique_name': uniqueName,
            'description': description,
            'name': nomvideo,
            'category': category
          },
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      voirCategories: function () {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/categories',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      getTagListing: function () {
        return $http({
          url: '/api/videos/tagListing'
        });
      },
      getListOfTags: function (uniqueName) {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/videos/' + uniqueName + '/tags',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      addATag: function (uniqueName, tag) {
        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/videos/' + uniqueName + '/tags/' + tag,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      deleteATag: function (uniqueName, tag) {
        return $http({
          withCredentials: true,
          method: 'DELETE',
          url: '/api/videos/' + uniqueName + '/tags/' + tag,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      recupTokenVideo: function (nomvideo) {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/videos/' + nomvideo + '/play',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
          /*,
                    cache:true*/
        })
      },
      authentification: function (xAuth, xAuthType) {
        xAuth = btoa(xAuth);
        return $http({
          method: 'POST',
          url: '/api/auth',
          headers: {
            'Content-type': 'application/json',
            'x-auth': "rG8x*Cp " + xAuth,
            'x-auth-type': xAuthType
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
      },
      createFacebookAccount: function (pwd, email, firstname, lastname, telephone, address, city, country, state, language, socialNetwork) {
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
            'language': language,
            'socialNetwork': socialNetwork
          },
          headers: {
            'Content-type': 'application/json'
          }
        });
      },
      createGoogleAccount: function (pwd, email, firstname, lastname, telephone, address, city, country, state, language, socialNetwork) {
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
            'language': language,
            'socialNetwork': socialNetwork
          },
          headers: {
            'Content-type': 'application/json'
          }
        });
      },
      recupLocalization:
        /* function () {
                return $http.get("vendors/localization/countries.json");
              }*/
        function () {
          return $http({
            withCredentials: true,
            method: 'GET',
            url: '/api/' + 'country/all',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          });
        },
      getStates: function (data) {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/' + 'country/' + data + '/states',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
     /* recupLocalization: function () {
        return $http.get("vendors/localization/countries.json");
      },*/
      recupLangues: function () {
        return $http.get("vendors/localization/languagesList.json");
      },
      getVideoCategory: function (videoUniqueName) {
        return $http({
          method: 'GET',
          url: '/api/videos/' + videoUniqueName + '/category',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      editAccount: function (username, newEmail, firstname, lastname, telephone, address, city, country, state, language) {
        return $http({
          method: 'POST',
          url: '/api/users/',
          data: {
            'username': username,
            'email': newEmail,
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
      deleteVideo: function (uniqueName) {
        return $http({
          withCredentials: true,
          method: 'DELETE',
          url: '/api/videos/' + uniqueName,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      setVideoStatus: function (uniqueName, status) {

        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/stream/' + uniqueName + '/status?newStatus=' + status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      toAuction: function (uniqueName, adding) {
        var status = adding === true ? 'AUCTION' : 'READY';

        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/stream/' + uniqueName + '/status?newStatus=' + status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },

      loadLanguage: function (language) {
        return $http.get('vendors/' + language + '-Language.json');
      },
      getCategoryListing: function () {
        return $http({
          url: '/api/videos/categories'
        });
      },
      getTagListing: function () {
        return $http({
          url: '/api/videos/tagListing'
        });
      },
      getVideoSoldHistory: function (uniqueName) {
        return $http({
          url: '/api/videos/' + uniqueName + '/soldHistory'
        });
      },
      getVideoAuctionBidHistory: function (uniqueName) {
        return $http({
          withCredentials: true,
          url: '/api/videos/' + uniqueName + '/bidHistory'
        });
      }

    };
  });