;
(function (video911App, $, window, undefined) {

    "use strict";

    video911App.controller("videoViewingController", function ($scope, $state, $rootScope, API911video, NgMap) {

        $scope.videosTest = [{
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
        }];

        var video = false;
        var base_video = 'http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/';

        console.log($state, "STATE")

        $scope.current_video = {
            location: $state.params.lat + ',' + $state.params.lng,
            number: 1,
            poster: base_video + $state.params.id + "/thumbnail"
        }

        setTimeout(function () {
            NgMap.initMap("Map")
        }, 0)


        $scope.onLoad = function () {
            var player = document.getElementById('mainVideo');

            if (player != null) {
                player.onplay = function () {
                    API911video.Viewed($scope.video).then(function (response) {
                        console.log("viewed")
                    });
                };
            }
        }


        $scope.initVideo = function (video_id, lat, lng, number) {

            $scope.video = video_id;

            if (video_id && lat && lng) {



                $scope.current_video = {
                    location: lat + ',' + lng,
                    number: number,
                    poster: base_video + video_id + "/thumbnail"
                }

                API911video
                    // .getVideos()
                    .getNearVideos(100, lat, lng)
                    .then(function (rs) {
                        $scope.near_videos = rs.data;
                        console.log(rs)
                    }, function (err) {
                        console.log(err)
                    })



                var Video = document.querySelector("#mainVideo");

                Video.innerHTML = '';

                var extensions = ["webm", "mp4"];



                for (var x in extensions) {

                    var source = document.createElement("source");
                    source.src = base_video + "/" + video_id + "/extensions/" + extensions[x];
                    source.type = "video/" + extensions[x];

                    $(Video).append(source);

                }

                Video.load();
            }
        }

        console.log($state.params, "PARAMS");


        $scope.initVideo($state.params.id, $state.params.lat, $state.params.lng)





        $scope.getUrl = function (unique_name) {
            return 'http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/' + unique_name + '/extensions/mp4';
        }

        $scope.getThumb = function (unique_name) {

            return 'http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/' + unique_name + '/thumbnail'
        }


        /**
        $scope.$watch('$parent.selectedVideo', function(newVal, oldVal) {
            if(newVal !== undefined) {
                $scope.selectedVideo = newVal;
                $scope.selectedVideo.addSource("#video");
                initMap();
            }
        });
     */

        $scope.backToList = function () {
            $scope.$parent.selectedVideo = undefined;
            $scope.selectedVideo = undefined;
            $("#video").empty();
            $("#video").load();
        };




        function initMap() {
            var coords = $scope.selectedVideo.getCoordinates();

            var map = new google.maps.Map(document.getElementById('videoMap'), {
                center: {
                    lat: coords.latitude,
                    lng: coords.longitude
                },
                scrollwheel: false,
                zoom: 12
            });

        }




    });

})(video911App, jQuery, window);