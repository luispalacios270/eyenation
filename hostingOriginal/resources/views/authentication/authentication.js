var authModule = angular.module('hosting.authentication', ['ngRoute', 'hosting.services'])
  /*
   * Define routing and views.
   */
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when("/", {template: "", controller: "authenticationController"}).
      when("/logout", {template: "", controller: "logoutController"}).
      when("/moneyfornews", {template: "", controller: "mfnController"}).
      when("/911Videos", {template: "", controller : "911VideoRedirectionController"} );
  }])
  .controller('authenticationController', function($location, $scope, $cookies, servicesAPI) {
    //Check if there is already a user connected
    //If so: redirection to home
    if($cookies.get("e-session")){
      servicesAPI.verifAuthentifie()
      .success(function(user) {
        window.localStorage.user = JSON.stringify(user);
        $location.path("/home");
      });
      }
    /*
    $("body").css("background-color", "#000");

    $scope.validate = function(user) {

    //We check if there is a given password in the form: if there is no password, we end the treatment
    if(user.password!=undefined){

      var nom=user.name;
      var pos=nom.search("@");
      var xAuthType="0";

      // If there is an '@' character in the identifiant, it has to be a user email. Otherwise it's a username
      if(pos!=-1){ //Case where there is a '@'
        xAuthType="1";
      }

      var xAuth="";
      xAuth=user.name+":"+user.password;
      servicesAPI.authentification(xAuth,xAuthType)
        .success(function(user) {
                  if(user.media_agent == undefined)
                      $location.path("/home");
                  else
                      window.location.href = "../money4news/#/accueil";
        })

        .error(function(){
          $scope.authPb=true;
        }
      );
      ///
    }
    };*/

  })
  .controller('logoutController', function($location, $scope, $cookies, servicesAPI) {
      $cookies.remove("e-session", {path: "/"});
      window.localStorage.removeItem("user");
      $cookies.remove("e-session", {path: "/"});
      window.location.href = "../#login";
  })
  .controller('mfnController', function($location, $scope, $cookies, servicesAPI) {
    servicesAPI.verifAuthentifie()
    .success(function(data) {
//      console.log(user);
      if(data.user.media_agent == undefined) {
        window.location.href = "../#login";
        alert("Connectez vous en tant qu'agent de média pour acceder à ce contenu");
      } else
                window.location.href = "../money4news/#/accueil";
    });


  })
;
