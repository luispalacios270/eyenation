angular.module('911Video'
  /*, ['ngMaterial',
      'ngMessages',
      'ngAnimate',
    ]*/
)
  .controller('authenticationController', AuthCtrl);

function AuthCtrl($scope, AuthAPI, $cookies, $state, APIvideoFromNumber, $validations) {

  $scope.user = {};
  $scope.validateLoginFor = function (user) {

    var xAuthType;
    if (user.name && user.pwd)
      xAuthType = 1;
    else
      return;

    var connectString = btoa(user.name + ':' + user.pwd);
    AuthAPI.authenticate(connectString, xAuthType).then(function (user) {
      if (user !== undefined) {
        if (user.data && user.data.securityType) {
          console.log(user, "USER LOGIN");

          window.localStorage.user = JSON.stringify(user.data);
          window.location = "/911videos/"

        } else
          window.location = "/911videos";
      }
    }, function (err) {
      console.log(err);
      bootbox.alert("Un employé de 911.VIDEO vous contactera sous peu afin de vous autoriser à accéder ");
    });
  };

  $scope.goToVideoFromNumber = function () {
    console.log("tel", $scope.telNumber);
    if ($validations.phone($scope.telNumber)) {
      APIvideoFromNumber.get(parseInt($scope.telNumber)).then(function (rs, code) {
        console.log(rs);
        rs = rs.data[0];
        console.log(rs, "result");
        let paramObject = {
          number: $scope.telNumber
        }
        if (rs != undefined) {
          paramObject.id = rs.unique_name;
          paramObject.lat = rs.gps_coordinates[0].latitude;
          paramObject.lng = rs.gps_coordinates[0].longitude;
        }
        /* var url = $state.href('accueilpolicedetail', {
          id: rs.unique_name,
          lat: rs.gps_coordinates[0].latitude,
          lng: rs.gps_coordinates[0].longitude
        }); */
        var url = $state.href('accueilpolicedetail', paramObject);
        window.open(url, '_self');
      }, function (err, code) {

        if (code === 404)
          bootbox.alert("No video to show from this number");
        console.log(err, code, "API error");
        throw "API error";

      });
      /*var url = $state.href('accueilpolicedetail', {
        id: rs.unique_name,
        lat: rs.gps_coordinates[0].latitude,
        lng: rs.gps_coordinates[0].longitude
      });
      window.open(url, '_self');*/
    } else
      bootbox.alert("Enter a valid number");
  }

  if ($cookies.get("e-session")) {
    AuthAPI.verifAuthentifie(function (calls) {
      if (calls !== undefined) {

        var nomalUser = calls[0].then(function (resp) {
          if (resp !== undefined && resp.localization)
            location.href = '/hosting';
        });
        var secUser = calls[1].then(function (resp) {

          if (resp !== undefined && resp.securityType)
            location.href = '/911videos';
        });

      }
    });
  }

}