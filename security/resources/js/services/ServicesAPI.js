angular.module('911Video')
  .factory('servicesAPI', function ($http) {

      return {
        getCountries: function(){
           return $http({
              withCredentials: true,
              method: 'GET',
              url: '/api/country/all',
              headers: {'Content-Type': 'application/json; charset=utf-8'}});
         },
         getStates: function(data){
           return $http({
              withCredentials: true,
              method: 'GET',
              url: '/api/country/'+data+'/states',
              headers: {'Content-Type': 'application/json; charset=utf-8'}});
         },
        createSecurityPerson: function(data){
           return $http({
              withCredentials: true,
              method: 'POST',
              url: '/api/users/securityUser',
              data :  data,
              headers: {'Content-Type': 'application/json; charset=utf-8'}});
         },
        recupLangues: function(){
          return $http.get("resources/localization/languagesList.json");
        }
    };

  });
