//vFromNumberService.js

angular.module('base')
  .service('$APIvFromNumber', vFromNumber)
  ;

function vFromNumber($q, $http, $config){

	var APIbase = $config.APIbase;
 

    this.get = function (number) {

        
        route = APIbase + "911videos/from-number/" + number + "/2";
      
        return $http.get(route);

    }


    return this;
    

   
}

