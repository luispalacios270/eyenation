function Service($q, $http){

	var APIbase = "/api/";


    this.getSecurityUser = function () {


        route = APIbase + "users/securityUser/current";

        return $http.get(route);

    }


    this.passwordReset = function(data){
        route = APIbase + "users/securityUser/changePwd";

        return $http.post(route, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});
    }


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

        return $http.post(route, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});


    }







    return this;



}

angular.module('911Video')
  .service('APIuser', Service)
  ;
