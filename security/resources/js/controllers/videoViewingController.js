;( function ( video911App, $, window, undefined ) {

    "use strict";

    video911App.controller("videoViewingController", function( $scope, $state, $rootScope, API911video) {

        var video = false;

        console.log($state, "STATE")

        if($state.params.video){
            video = $state.params.video;
            init(video);
        }
        else if($state.params.id)
        {
            //let's get the video by id from 911 rest api

            console.log("hello");

            $state.params.video = decodeURI($state.params.id);

            console.log($state.params.id);

            if(JSON.parse($state.params.id))
            {
              $rootScope.fromNumber = true;
              video = JSON.parse($state.params.id);
              init(video);

            }else{
                //load video by unique
            }

        }
        

        $scope.onLoad = function(){
          var player = document.getElementById('mainVideo'); 

            if(player != null){
                player.onplay = function () {
                     API911video.Viewed($scope.video).success(function(response){ console.log("viewed") });
                };
            }
        }


        function init(video){


        if(video)
        {
             $(function(){

                    var Video = document.querySelector("#mainVideo");
                    var extensions = ["webm","mp4"];

                    for(var x in extensions)
                    {

                    var source = document.createElement("source");
                    source.src = "http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/"+video.unique_name+"/extensions/" + extensions[x];
                    source.type = "video/" + extensions[x];

                     $(Video).append(source);

                     }



                    Video.load();

             })

             //load near videos

             API911video
             .getNearVideos(100, video.gps_coordinates[0].latitude, video.gps_coordinates[0].longitude)
             .success(function(data){
                    console.log(data, "near videos");
                    $scope.near_videos = data;
             })
            .error(function(err){
                console.log(err)
            })

        }

        $scope.getUrl = function(unique_name){
            return 'http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/' + unique_name + '/extensions/mp4';
        }

        $scope.getThumb  = function(unique_name){

            return 'http://ec2-34-208-118-56.us-west-2.compute.amazonaws.com:3000/api/videos/' + unique_name + '/thumbnail'
        }

        $scope.video = video;

        /**
        $scope.$watch('$parent.selectedVideo', function(newVal, oldVal) {
            if(newVal !== undefined) {
                $scope.selectedVideo = newVal;
                $scope.selectedVideo.addSource("#video");
                initMap();
            }
        });
     */

        $scope.backToList = function() {
            $scope.$parent.selectedVideo = undefined;
            $scope.selectedVideo = undefined;
            $("#video").empty();
            $("#video").load();
        };


        function initMap() {
            var coords = $scope.selectedVideo.getCoordinates();

            var map = new google.maps.Map(document.getElementById('videoMap'), {
                center: {lat: coords.latitude, lng: coords.longitude},
                scrollwheel: false,
                zoom: 12
            });

        }

     }


    });

} )( video911App, jQuery, window);
