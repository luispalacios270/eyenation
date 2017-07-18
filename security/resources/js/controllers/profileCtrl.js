angular.module("911Video")
  .controller("profileCtrl", Ctrl);


function Ctrl($scope, $rootScope, APIlocalizations, APIuser) {

  //do stuff


  $scope.langueList = [{
      code: "fr",
      name: "Français"
    },
    {
      code: "en",
      name: "Anglais"
    }
  ]


  //security Types
  $scope.securityType = [{
      value: "1",
      name: "pour centrale 911"
    },
    {
      value: "2",
      name: "pour pompier"
    },
    {
      value: "3",
      name: "pour police"
    },
    {
      value: "4",
      name: "pour ambulancier"
    },
    {
      value: "5",
      name: "pour hôpital"
    },
    {
      value: "6",
      name: "pour remorquage"
    }
  ];





  //get current user

  APIuser.getSecurityUser().success(function (data) {

    $scope.user = data;
    $scope.user.country = {
      countryCode: data.countryCode || ''
    };
    $scope.user.state = {
      stateCode: data.stateCode || ''
    };
    $scope.user.language = {
      code: data.languageCode
    }
    $scope.user.securityType = {
      value: data.securityType
    };

    delete $scope.user.pwd;
    delete $scope.user.limited_service;
    delete $scope.user.ipAddress;
    delete $scope.user.timeJoined;
    delete $scope.user.stateCode;
    delete $scope.user.countryCode;

    console.log("USER SECURITY ", data)




  }).error(function (err) {
    console.log(err)
  })



  //get localizations

  APIlocalizations
    .getCountries()
    .then(function (data) {
      data = data.data;
      $scope.countries = data;
      console.log($scope.countries)
    })



  //get states

  $scope.getStates = function () {

    console.log(this, "Country");

    $scope.states = null;

    country = this.user.country;
    countryCode = country.countryCode;

    APIlocalizations.getStates(countryCode).then(function (data) {
      data = data.data;
      console.log(data, "STATES");
      $scope.states = data.states;
    })



  }


  //method that hadle update security user

  $scope.update = function () {

    if ($scope.user.country)
      $scope.user.country = $scope.user.country ? $scope.user.country.countryCode : null;

    if ($scope.user.securityType)
      $scope.user.securityType = $scope.user.securityType.value;

    if ($scope.user.state)
      $scope.user.state = $scope.user.state ? $scope.user.state.stateCode : null;

    if ($scope.user.language)
      $scope.user.language = $scope.user.language ? $scope.user.language.code : null;

    APIuser
      .updateSecurityUser($scope.user)
      .then(function (data) {
        alert("User updated");
        $scope.getSecurityUser();
      }, function (error) {
        alert("Error updating user");
      })

  }





}