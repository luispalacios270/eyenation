var baseCoors = "46.829853,-71.254028";

angular.module("911Video")
  .controller("policeController", policeController);




function policeController($scope, API911video, $state, $rootScope, NgMap, VIDEOS_BASE, $window, $http, GEOLOCATE_PATH, GEOLOCATE_KEY) {

  /*  $scope.videosTest = [{
      times_viewed: 8,
      streaming_endedon: 1496455795621,
      description: "",
      lastTimeVideoStatusChanged: 1496152404298,
      gps_coordinates: [{
        timezone: "UTC-5",
        latitude: 45.4798,
        longitude: -73.4804
      }],
      tags: [

      ],
      sold_amount: null,
      unique_name: "870dda02-b4e1-437c-a166-7e02cc01b201",
      person: {
        localization: {
          city: "defaut",
          street: "defaut",
          appartment_no: null,
          country_fips: "DF",
          state_abbreviation: "DEF"
        },
        language_code: "FR",
        firstname: "Alex",
        phone: "4508553537",
        citizen_perormance_status: null,
        seucrity_number: "14383851741",
        media_agent: {
          auction_limit: 100000,
          total_temp_bid_value: null,
          media: [{
            name: "Cnn"
          }],
          bought_video_amount: 250
        },
        email: "musicalex1987@gmail.com",
        username: "alexandreb",
        lastname: "Bouchard"
      },
      name: "aaaaaaaaaaaaaaaaa",
      category: [{
          translation: "Accident",
          name: "ACCIDENT",
          id: 1,
          lang: "en"
        },
        {
          translation: "Accident",
          name: "ACCIDENT",
          id: 1,
          lang: "fr"
        }
      ],
      streaming_startedon: 1496455795621,
      status: "READY",
      mediaWeight: null
    }, {
      times_viewed: 8,
      streaming_endedon: 1496455795621,
      description: "",
      lastTimeVideoStatusChanged: 1496152404298,
      gps_coordinates: [{
        timezone: "UTC-5",
        latitude: 45.4798,
        longitude: -73.4804
      }],
      tags: [

      ],
      sold_amount: null,
      unique_name: "870dda02-b4e1-437c-a166-7e02cc01b201",
      person: {
        localization: {
          city: "defaut",
          street: "defaut",
          appartment_no: null,
          country_fips: "DF",
          state_abbreviation: "DEF"
        },
        language_code: "FR",
        firstname: "Alex",
        phone: "4508553537",
        citizen_perormance_status: null,
        seucrity_number: "14383851741",
        media_agent: {
          auction_limit: 100000,
          total_temp_bid_value: null,
          media: [{
            name: "Cnn"
          }],
          bought_video_amount: 250
        },
        email: "musicalex1987@gmail.com",
        username: "alexandreb",
        lastname: "Bouchard"
      },
      name: "aaaaaaaaaaaaaaaaa",
      category: [{
          translation: "Accident",
          name: "ACCIDENT",
          id: 1,
          lang: "en"
        },
        {
          translation: "Accident",
          name: "ACCIDENT",
          id: 1,
          lang: "fr"
        }
      ],
      streaming_startedon: 1496455795621,
      status: "READY",
      mediaWeight: null
    }];*/




  console.log("ABABAB")

  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function (position) {


      $rootScope.userLocation = position.coords.latitude + "," + position.coords.longitude;

      $rootScope.$broadcast('geolocation', $rootScope.userLocation)

      $scope.getNearVideos(position.coords.latitude, position.coords.longitude)


      NgMap.initMap('Map');


      console.log($rootScope.userLocation);

    }, function () {

      $http({
          method: 'POST',
          url: GEOLOCATE_PATH + GEOLOCATE_KEY
        })
        .then(function (res) {

          $rootScope.userLocation = res.data.location.lat + "," + res.data.location.lng;

          NgMap.initMap('Map');

        })
        .catch(function (err) {

          $rootScope.userLocation = baseCoors;

          $rootScope.$broadcast('geolocation', $rootScope.userLocation)

          NgMap.initMap('Map');

        })

    });





  $scope.getNearVideos = function (latitude, longitude, meters) {

    return API911video
      .getNearVideos(100, latitude, longitude)

  }


  function loadData(ev, data) {

    var coordinates = data.split(',');

    $scope.getNearVideos(coordinates[0], coordinates[1])
      // API911video.getVideos()
      .then(function (rs) {
        rs = rs.data;
        $scope.videos = rs;
        console.log(rs)
      })

  }




  $scope.$on('mapInitialized', function (ev, map) {



    /*map.addListener('dragend', function () {

      var coordinates = map.getCenter();

      window.setTimeout(function () {

        var coordinates = map.getCenter();*/

    $scope.getNearVideos(coordinates.lat(), coordinates.lng())
      .then(function (rs) {
        rs = rs.data;
        $scope.videos = rs;
        console.log(rs)
      }, function (err) {
        console.log(err)
      });


    // }, 3000);

    // })


  });

  $scope.goToVideo = function () {

    console.log(this.video)

    var url = $state.href('accueilpolicedetail', {
      id: this.video.unique_name,
      lat: this.video.gps_coordinates[0].latitude,
      lng: this.video.gps_coordinates[0].longitude
    });
    window.open(url, '_blank');
  }

  $scope.windowHeight = angular.element($window).height();

  angular.element($window).bind('resize', function () {
    $scope.windowHeight = angular.element($window).height();

    // $scope.$apply();

  });


}


angular.module("911Video")
  .controller("videoDetail", function ($scope, API911video, $state, $rootScope, NgMap, VIDEOS_BASE, $window, $http, GEOLOCATE_PATH, GEOLOCATE_KEY) {
    /*  $scope.videosTest = [   {      
      times_viewed: 1,
            streaming_endedon: null,
            description: "",
            lastTimeVideoStatusChanged: 1495856049134,
            gps_coordinates: [         {            
        timezone: "UTC-5",
                    latitude: 46.2392,
                    longitude: -71.0354         
      }      ],
            tags: [

              
      ],
            sold_amount: null,
            unique_name: "5bb90fb7-d507-4e45-9344-24019d8a9d0a",
            person: {         
        localization: {            
          city: "Brossard sud",
                      street: "9125 rue lenno appt 10",
                      appartment_no: null,
                      country_fips: "CA",
                      state_abbreviation: "PQ "         
        },
                 language_code: "fr",
                 firstname: "Carlos",
                 phone: "514607053",
                 citizen_perormance_status: null,
                 media_agent: {            
          auction_limit: 1000000,
                      total_temp_bid_value: 200,
                      media: [               {                  
            name: "Cnn"               
          }            ],
                      bought_video_amount: 4971         
        },
                 email: "nayarithsolorzano@hotmail.com",
                 username: "krlosed22",
                 lastname: "vasquez perez pppp"      
      },
            name: "chez Gino",
            category: [         {            
        translation: "Accident",
                    name: "ACCIDENT",
                    id: 1,
                    lang: "en"         
      },           {            
        translation: "Accident",
                    name: "ACCIDENT",
                    id: 1,
                    lang: "fr"         
      }      ],
            streaming_startedon: 1495404830382,
            status: "READY",
            mediaWeight: null,
            location: "Quebec, Canadá"   
    },     {      
      times_viewed: 33,
            streaming_endedon: 1492537062000,
            description: "",
            lastTimeVideoStatusChanged: 1496083505193,
            gps_coordinates: [         {            
        timezone: "UTC-5",
                    latitude: 45.536,
                    longitude: -73.108         
      }      ],
            tags: [

              
      ],
            auction: {         
        numberBid: 3,
                 highestBid: 200,
                 start: 1496083524637,
                 end: 1496097924637,
                 media: [            {               
          name: "Cnn"            
        }         ]      
      },
            sold_amount: null,
            unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
            person: {         
        localization: {            
          city: "Brossard sud",
                      street: "9125 rue lenno appt 10",
                      appartment_no: null,
                      country_fips: "CA",
                      state_abbreviation: "PQ "         
        },
                 language_code: "fr",
                 firstname: "Carlos",
                 phone: "514607053",
                 citizen_perormance_status: null,
                 media_agent: {            
          auction_limit: 1000000,
                      total_temp_bid_value: 200,
                      media: [               {                  
            name: "Cnn"               
          }            ],
                      bought_video_amount: 4971         
        },
                 email: "nayarithsolorzano@hotmail.com",
                 username: "krlosed22",
                 lastname: "vasquez perez pppp"      
      },
            name: "video test modifi",
            category: [         {            
        translation: "Autos",
                    name: "Autos",
                    id: 21,
                    lang: "fr"         
      },           {            
        translation: "Autos",
                    name: "Autos",
                    id: 21,
                    lang: "en"         
      }      ],
            streaming_startedon: 1492537062000,
            status: "AUCTION",
            mediaWeight: null,
            counter: 5794,
            location: "Quebec, Canadá"   
    },     {      
      times_viewed: 26,
            streaming_endedon: 1492537062000,
            description: "",
            lastTimeVideoStatusChanged: 1495066980780,
            gps_coordinates: [         {            
        timezone: "UTC-5",
                    latitude: 42.536,
                    longitude: -71.108         
      }      ],
            tags: [

              
      ],
            sold_amount: null,
            unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
            person: {         
        localization: {            
          city: "Brossard sud",
                      street: "9125 rue lenno appt 10",
                      appartment_no: null,
                      country_fips: "CA",
                      state_abbreviation: "PQ "         
        },
                 language_code: "fr",
                 firstname: "Carlos",
                 phone: "514607053",
                 citizen_perormance_status: null,
                 media_agent: {            
          auction_limit: 1000000,
                      total_temp_bid_value: 200,
                      media: [               {                  
            name: "Cnn"               
          }            ],
                      bought_video_amount: 4971         
        },
                 email: "nayarithsolorzano@hotmail.com",
                 username: "krlosed22",
                 lastname: "vasquez perez pppp"      
      },
            name: "vid",
            category: [         {            
        translation: "Terrorism",
                    name: "TERRORIMS",
                    id: 6,
                    lang: "en"         
      },           {            
        translation: "Terrorisme",
                    name: "TERRORIMS",
                    id: 6,
                    lang: "fr"         
      }      ],
            streaming_startedon: 1492537062000,
            status: "READY",
            mediaWeight: null   
    }];
*/
    $scope.selectVideo = function (video, $index) {
      var base_video = VIDEOS_BASE + video.unique_name;
      if ($scope.currentVideo != null) {
        $scope.videos.unshift($scope.currentVideo);
        $index = $index + 1;
      };
      $scope.currentVideo = video;
      $scope.videos.splice($index, 1);
      $scope.mapSelected = false;
      var Video = document.querySelector("#mainVideo");
      Video.innerHTML = '';
      var extensions = ["webm", "mp4"];
      for (var x in extensions) {
        var source = document.createElement("source");
        source.src = base_video + "/extensions/" + extensions[x];
        source.type = "video/" + extensions[x];

        $(Video).append(source);
      }
      Video.load();
      var player = document.getElementById('mainVideo');

      // console.log(video)

      if (player != null) {
        player.onplay = function () {
          API911video.Viewed(video.unique_name).then(function (response) {
            console.log("viewed")
          });
        };

      }
    };



    $scope.onLoad = function (video) {
      var player = document.getElementById('mainVideo');

      console.log(video)

      if (player != null) {
        player.onplay = function () {
          API911video.Viewed(video.unique_name).then(function (response) {
            console.log("viewed")
          });
        };
      }
    }


    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(function (position) {


        $rootScope.userLocation = position.coords.latitude + "," + position.coords.longitude;

        $rootScope.$broadcast('geolocation', $rootScope.userLocation)

        $scope.getNearVideos(position.coords.latitude, position.coords.longitude)


        /* NgMap.initMap('Map');*/
        // NgMap.initMap('bigMap');


        console.log($rootScope.userLocation);

      }, function () {

        $rootScope.userLocation = baseCoors;

        $http({
            method: 'POST',
            url: GEOLOCATE_PATH + GEOLOCATE_KEY
          })
          .then(function (res) {

            $rootScope.userLocation = res.data.location.lat + "," + res.data.location.lng;

            NgMap.initMap('Map');
            //NgMap.initMap('bigMap');

          }, function (err) {
            $rootScope.userLocation = baseCoors;
            loadData('geolocationOK', $rootScope.userLocation);
            NgMap.initMap('Map');
          })

      });



    $scope.getNearVideos = function (latitude, longitude) {

      return API911video
        .getNearVideos(100, latitude, longitude)
      // .getVideos()

    }





    $scope.initVideo = function (video_id, lat, lng, number) {

      if (video_id && lat && lng) {

        var base_video = VIDEOS_BASE + video_id;

        $scope.current_video = {
          location: lat + ',' + lng,
          number: number,
          poster: base_video + "/thumbnail",
          latitude: lat,
          longitude: lng,
          unique_name: video_id
        }

        $scope.isBigMapVisible = false;
        $("#MAPP").addClass("toleft");



        $scope.getNearVideos(lat, lng)
          .then(function (rs) {
            rs = rs.data;
            $scope.videos = rs;
            /*console.log(rs)
            $(function () {
              NgMap.initMap('Map');
            });*/

          }, function (err) {
            console.log(err)
          })



        /*var Video = document.querySelector("#mainVideo");

        Video.innerHTML = '';
        var extensions = ["webm", "mp4"];
        for (var x in extensions) {
          var source = document.createElement("source");
          source.src = base_video + "/extensions/" + extensions[x];
          source.type = "video/" + extensions[x];

          $(Video).append(source);

        }


        Video.load();*/
      }


    }

    $scope.toggleMap = function (isVideo) {


      $scope.isBigMapVisible = true;

      $("#MAPP").removeClass("toleft");

      NgMap.initMap('bigMap');

      google.maps.event.trigger($scope.map, 'resize');



    }

    $scope.toggleVideo = function (isVideo) {


      $scope.isBigMapVisible = false;

      $("#MAPP").addClass("toleft");

      //NgMap.initMap('bigMap');

      //google.maps.event.trigger($scope.map, 'resize');


    }


    $scope.initVideo($state.params.id, $state.params.lat, $state.params.lng, 1);

    $scope.windowHeight = angular.element($window).height();

    angular.element($window).bind('resize', function () {

      $scope.windowHeight = angular.element($window).height();

      // $scope.$apply();

    });

  })