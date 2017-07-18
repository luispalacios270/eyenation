function Service($q, $http) {

  var APIbase = "/api/";


  this.getCountries = function () {
    return $http({
      withCredentials: true,
      method: 'GET',
      url: APIbase + 'country/all',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }


  this.getStates = function (data) {
    return $http({
      withCredentials: true,
      method: 'GET',
      url: APIbase + 'country/' + data + '/states',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }




  return this;



}

angular.module('911Video')
  .service('APIlocalizations', Service);