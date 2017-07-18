angular.module('money4news.services', [])
  .factory('servicesAPI', function ($http) {
    return {
      getCurrentMediaAgent: function () {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/users/current',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      getVideos: function (index, categories, tags, order, orderby, email, videoName) {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/money4news/videos/auction?index=' + index + '&categories=' + categories + '&tags=' + tags + '&order=' + order + '&orderby=' + orderby + '&email=' + email + '&videoName=' + videoName,
          // data: {'index': index, 'categories': categories, 'tags': tags,'order': order, 'orderby': orderby,'email': email},
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      getVideosByOffer: function (order) {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/money4news/videos/auction/bid?orderby=' + order,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      getVideosByCategory: function (category) {
        return $http({
          withCredentials: true,
          method: 'GET',
          url: '/api/money4news/videos/auction/category/' + category,
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
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
      },
      createAuction: function (uniqueName, amount, maxBidAutoAmount) {
        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/money4news/videos/' + uniqueName + '/auction',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            'amount': amount,
            'maxBidAutoAmount': maxBidAutoAmount
          }
        });
      },
      makeABid: function (uniqueName, amount, maxAmount) {
        return $http({
          withCredentials: true,
          method: 'POST',
          url: '/api/money4news/videos/' + uniqueName + '/auction/bid',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            'amount': amount,
            'maxAmount': maxAmount
          }
        });
      },
      getLocationByCoordinates: function (lattitude, longitude) {
        return $http({
          method: 'GET',
          url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lattitude + ',' + longitude + '&key=AIzaSyCONaNr9i82Z8O0z6XUVfkLuA0kL4AV5Yg',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
          /*skipAuthorization: true*/

        });
      },
      incrementVideoViewCount: function (videoUniqueName) {
        return $http({
          method: 'POST',
          url: '/api/videos/' + videoUniqueName + '/viewed'
        });
      },
      getUserAuctionBids: function () {
        return $http({
          method: 'GET',
          url: '/api/money4news/videos/user/bids'
        });
      },
      getUserBidForVideo: function (videoUniqueName) {
        return $http({
          method: 'GET',
          url: '/api/money4news/videos/' + videoUniqueName + '/userBid',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      getLanguage: function (language) {
        return $http.get("vendors/" + language + "-Language.json");
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
      getMediaAgentHomeCoordinates: function (address) {
        return $http({
          method: 'GET',
          url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDaVVb8BMD8z9OeOHQOxDNcP6r0u-JXrAA',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      },
      //Add to execute modifications in accounts directly from moneyforNews page.
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
      recupLangues: function () {
        return $http.get("vendors/localization/languagesList.json");
      },

      /*var APIbase = "/api/";
  this.getCountries = function () {
    return $http({
      withCredentials: true,
      method: 'GET',
      url: APIbase + 'country/all',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  };


  this.getStates = function (data) {
    return $http({
      withCredentials: true,
      method: 'GET',
      url: APIbase + 'country/' + data + '/states',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }*/
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
    };
  });