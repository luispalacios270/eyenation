angular.module('hosting.home', ['ngRoute', 'hosting.services', 'ngCookies', 'hosting.prefs'])
  /*
   * Define routing and views.
   */
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider
      .when("/home", {
        templateUrl: "resources/views/home/home.html",
        controller: "homeController"
      });
  }])
  .controller('homeController', function ($location, servicesAPI, $scope, $cookies, prefLoader) {
    $("body").css("background-color", "#f1f1f1");
    $scope.user = {};
    $scope.m4nAccess = false;

    prefLoader.getLanguage().then(
      function (resp) {
        $scope.userLanguageMenuOptions = resp.data.header_menu_options;
        $scope.userHomePageVocab = resp.data.home_page;
      },
      function (err) {
        console.log(err);
      }
    );

    $scope.selectLanguage = function (lang) {
      prefLoader.changeLanguage(lang).then(
        function (resp) {
          $scope.userLanguageMenuOptions = resp.data.header_menu_options;
          $scope.userHomePageVocab = resp.data.home_page;
        },
        function (err) {
          console.log(err);
        }
      );
    };

    var cookie = $cookies.get("e-session");
    var cookieSuccessModification = $cookies.get("modifOk");

    if (!cookie) {
      $location.path("../#login");
    }

    if (cookieSuccessModification == "1") {
      $scope.modifSuccess = true;
      $cookies.put("modifOk", "0");
    } else {
      $scope.modifSuccess = false;
    }

    /*servicesAPI.verifAuthentifie()
      .then(function (data) {
        data = data.data;
        $scope.user = data;
        if (data.user.media_agent !== undefined)
          $scope.m4nAccess = true;
        console.log(data);
      }, function () {
        $cookies.remove("e-session", {
          path: "/"
        });
        window.location.href = "./../#login";
      });*/
  });