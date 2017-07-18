function Service($q, $http, API_BASE) {

  var APIbase = API_BASE;

  this.getSecurityUser = function () {
    route = APIbase + "users/securityUser/current";
    return $http.get(route);
  }

  this.getCountries = function () {
    return $http({
      withCredentials: true,
      method: 'GET',
      url: '/api/country/all',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  };
  
  this.getStates = function (data) {
    return $http({
      withCredentials: true,
      method: 'GET',
      url: '/api/country/' + data + '/states',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  };

  this.recupLangues = function () {
    return $http.get("resources/localization/languagesList.json");
  };


  this.updateSecurityUser = function (data) {
    /*

        Body request

    var username = req.body.username;
    var email = req.body.email;
    var securityType = req.body.securityType;
    var streetName = req.body.streetName;
    var language = req.body.language;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var zipcode = req.body.zipcode;
    var city = req.body.city;
    var country = req.body.country;
    var state = req.body.state;
    var telephone = req.body.telephone;
    var workPhone = req.body.workPhone;
    var workPhoneExt = req.body.workPhoneExt;
    var appartment = req.body.appartment;

        */
    route = APIbase + "users/securityUser/current";

    return $http.post(route, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
  this.passwordReset = function (data) {
    route = APIbase + "users/securityUser/changePwd";

    return $http.post(route, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
  return this;
}

angular.module('911Video')
  .service('APIuser', Service);