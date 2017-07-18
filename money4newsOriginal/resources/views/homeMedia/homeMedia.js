var m4nModule = angular.module('money4news.homeMedia', ['ngRoute', 'money4news.services','slick',"ngSanitize", "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "com.2fdevs.videogular.plugins.overlayplay",
            "com.2fdevs.videogular.plugins.poster",
            "com.2fdevs.videogular.plugins.buffering",'ui.bootstrap'])
    /*
     * Define routing and views.
     */
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
            when("/accueil", {templateUrl: "resources/views/homeMedia/homeMedia.html", controller: "homeController"});
    }])
    .controller("notificationController", function($scope, $modalInstance, message) {
        var opposingBid = message.msg[0];
        var myBid = message.msg[1];

        $scope.videoName = myBid.video[0].name;
        $scope.videoThumbnail = '../api/videos/' + myBid.video[0].unique_name + '/thumbnail';
        $scope.myBidValue = myBid.bidCurrentAmount;
        $scope.opposingValue = opposingBid.bidCurrentAmount;
        $scope.opposingMediaFaction = opposingBid.media.media.name;


        $scope.close = () => {
            $modalInstance.close();
        };

    })
    .controller("homeController",function($interval,$scope,servicesAPI,$timeout,$sce,$modal,$window,prefLoader){

        $scope.controller = this;
        $scope.controller.state = null;
        $scope.controller.API = null;
        $scope.controller.currentVideo = 0;
        $scope.videoLue=[];
        $scope.recentVideos=[];
        $scope.highestBidVideos=[];
        $scope.nearEndAuctionVideos=[];
        $scope.mostViewedVideos=[];
        $scope.userBidVideos = [];
        $scope.selectedVideo={};
        $scope.auctionVisionning=false;
        $scope.htmlVideoUsed=false;
        $scope.videogularUsed=true;
        $scope.lang = "";
        $scope.langTranslationIndex;
        $scope.dataLoading = {};
        $scope.dataLoading.recents = false;
        $scope.dataLoading.mostViewed = false;
        $scope.dataLoading.highestBids = false;
        $scope.dataLoading.userBids = false;
        $scope.dataLoading.nearEnd = false;
        $scope.videoBoughtAmount = 0;
        $scope.creditsLeft = 0;
        $scope.controller.rating2 = 1;
        $scope.controller.isReadonly = true;

        var videoPlanCoordinates=[];
        var auctionTimeout;
        var userAgent = $window.navigator.userAgent;
        var categ = [];
        var tags = [];

        /****** Notification system initialization ******/
        ( () => {
            document.addEventListener('BidUpdateNotifications', function(e) {
                var msgObj = JSON.parse(e.detail, '\\');
                var msgType = msgObj.type;
                var bidList = JSON.parse(msgObj.bidList, '\\');

                toggleNotificationView( bidList, undefined );
                updateScopeValues(bidList[0]);
            });

            function updateScopeValues( highestbid ) {
                if($scope.selectedVideo !== undefined) {
                    $scope.selectedVideo.auction.highestBid = highestbid.bidCurrentAmount;  //adjusting video auction value
                    $scope.currentOffer = highestbid.bidCurrentAmount;  //adjusting the current highest offer
                    $scope.initialMinimum = highestbid.bidCurrentAmount + 50;  //adjusting the html input step value
                }
            }

            NotificationManager.MessageHandler.init();
        } )();
        /****** End ******/

        prefLoader.getLanguage().then(
            function(resp){
                $scope.homePageVocabulary = resp.data.homePageVocabulary;
                $scope.auctionVocabulary = resp.data.auctionVocabulary;
                $scope.lang = $scope.homePageVocabulary.language.toLowerCase();
                $scope.langTranslationIndex = selectLangTranslationIndex($scope.lang.toUpperCase());
            },
            function(err){
                console.log(err);
            }
        );

        servicesAPI.getUserAuctionBids().then(function(resp) {
            if(resp.data != "") {
                $scope.userBidVideos = resp.data;
            }
        }, function(err) {
            console.log(err);
        });

        if(browserDetection(userAgent)=="ie" || browserDetection(userAgent)=="edge" || browserDetection(userAgent)=="safari"){
            $scope.htmlVideoUsed = true;
            $scope.videogularUsed = false;
        }

        /*Geolocation of the media agent and initialization of the map with 10km radius around  the media agent*/
        mediaAgentGeolocalisation();


        ////////////////////////////Carousels displaying/////////////////////////


        //////////////////////////////////////////Loading of the current media agent and of the dictionnary according to the selected language//////////////
        servicesAPI.getCurrentMediaAgent().success(function(data){
            $scope.mediaAgentFirstname = data.user.firstname;
            $scope.mediaAgentLastname = data.user.lastname;

            $scope.mediaCompany = data.user.media_agent.media.name;
            $scope.videoBoughtAmount = data.user.media_agent.bought_video_amount;
            $scope.creditsLeft = data.user.media_agent.auction_limit - data.user.media_agent.bought_video_amount - data.user.media_agent.total_temp_bid_value;
        })

        $scope.selectLanguage=function(lang){
            var auction = $scope.selectedVideo.auction;
            prefLoader.changeLanguage(lang).then(
                function(resp){
                    $scope.homePageVocabulary = resp.data.homePageVocabulary;
                    $scope.auctionVocabulary = resp.data.auctionVocabulary;
                    $scope.lang = $scope.homePageVocabulary.language.toLowerCase();
                    $scope.langTranslationIndex = selectLangTranslationIndex($scope.lang.toUpperCase());
                    if(auction == undefined)
                        $scope.currentOffer = $scope.auctionVocabulary.noOffers;
                },
                function(err){
                    console.log(err);
                }
            );
        };

        $scope.getTagTranslation = function(tag) {
            var lang = $scope.lang.toLowerCase();
            for(var t in tag.translation) {
                if(tag.translation[t].lang.toLowerCase() === lang)
                    return tag.translation[t].translation;
            }
        };

        var rainbow = function(){
            var r = Math.floor((Math.random() * 255) + 0);
            var g = Math.floor((Math.random() * 255) + 0);
            var b = Math.floor((Math.random() * 255) + 0);
            var a = .125;

            return r + ',' + g + ',' + b + ',' + a;
        }

        //variable stocking the interval for the countdown of the remaining time for the auction
        $scope.displayAuction=function(index,section){
            $("html, body").animate({ scrollTop: 0 }, "slow");
            var lattitudeAverage=0;
            var longitudeAverage=0;

            switch(section){
                case "recentVideos":
                    $scope.selectedVideo=$scope.recentVideos[index];
                    $scope.auctionVisionning=true;
                break;
                case "reporterVideos":
                    $scope.selectedVideo=$scope.reporterVideos[index];
                    $scope.auctionVisionning=true;
                break;
                case "highestBidVideos":
                    $scope.selectedVideo=$scope.highestBidVideos[index];
                    $scope.auctionVisionning=true;
                break;
                case "nearEndAuctionVideos":
                    $scope.selectedVideo=$scope.nearEndAuctionVideos[index];
                    $scope.auctionVisionning=true;
                break;
                case "mostViewedVideos":
                    $scope.selectedVideo=$scope.mostViewedVideos[index];
                    $scope.auctionVisionning=true;
                break;
                case "userBidVideos" :
                    $scope.selectedVideo = $scope.userBidVideos[index].video[0];
                    $scope.auctionVisionning=true;
                break;
            }

            /*We stock the video metadatas into the scope to display them in the auction page*/
            $scope.controller.rating2 = 2;
            var name = $scope.selectedVideo.name;
            $scope.selectedVideoTitle= name || "";

            //We calculates the average of the GPS coordinates of the selecte video to return the name of the place
            videoPlanCoordinates=[];
            for(var i=0;i<$scope.selectedVideo.gps_coordinates.length;i++){
                lattitudeAverage+=$scope.selectedVideo.gps_coordinates[i].latitude;
                longitudeAverage+=$scope.selectedVideo.gps_coordinates[i].longitude;
                  videoPlanCoordinates.push({lat: $scope.selectedVideo.gps_coordinates[i].latitude, lng: $scope.selectedVideo.gps_coordinates[i].longitude});
             }
             lattitudeAverage=lattitudeAverage/$scope.selectedVideo.gps_coordinates.length;
             longitudeAverage=longitudeAverage/$scope.selectedVideo.gps_coordinates.length;
             servicesAPI.getLocationByCoordinates(lattitudeAverage,longitudeAverage).success(function(data){

                 $scope.videoPlace=data.results[1].formatted_address;
              });
            // we retrieve the remaining time and the current offer
            if($scope.selectedVideo.auction == undefined){
                $scope.remainingTime="-";
                $scope.noOffers= $scope.auctionVocabulary.noOffers;
            }else {
                auctionTimeout = $interval(function(){
                    setAuctionCountdown(auctionTimeout);
                },1000);
                $scope.currentOffer= $scope.selectedVideo.auction.highestBid;
                $scope.leadingAuctionAmount = $scope.selectedVideo.auction.topAuctionAmount;
                servicesAPI.getUserBidForVideo($scope.selectedVideo.unique_name).then( function(resp) {					//call to get user auction specs
                    $scope.selectedVideo.auction.my_last_value = resp.data.myHighestBid;
                }, function(err) {
                    console.log(err);
                });
            }

            $scope.citizenReporterName = $scope.selectedVideo.person.firstname + ' ' + $scope.selectedVideo.person.lastname;
            //We retrieve the tags of the selected video
            $scope.selectedVideoTags = "";
            for(var i = 0 ; i < $scope.selectedVideo.tags.length; ++i) {
                var tag = $scope.selectedVideo.tags[i];
                if(tag != undefined) {
                    $scope.selectedVideoTags += toStandardCase($scope.selectedVideo.tags[i].translation[$scope.langTranslationIndex].translation);
                    //$scope.selectedVideoTags += toStandardCase($scope.getTagTranslation( $scope.selectedVideo.tags[i] );
                    if( i != $scope.selectedVideo.tags.length - 1)
                        $scope.selectedVideoTags += ' - ';
                }
            }

            /*Part corresponding to the video player for the page with details of the selected auction*/
            servicesAPI.recupTokenVideo($scope.selectedVideo.unique_name)
                .success(function(data) {

                    $scope.token = data;
                    var tok=data.viewing_token;
                    var uniqueName=$scope.selectedVideo.unique_name;
                    path = '/api/videos/'+$scope.selectedVideo.unique_name+'/play/'+tok+'/mp4';

                    var videoTag=document.getElementById("videoTag");
                    var sourceMP4=document.getElementById("sourceMP4");
                    var parentVideoTag=document.getElementById("parentVideoTag");
                    var newVideoTag=document.createElement("video");
                    var idVideo=document.createAttribute("id");
                    var controlsVideo=document.createAttribute("controls");
                    var heightVideo=document.createAttribute("height");
                    var widthVideo=document.createAttribute("width");
                    var player = document.getElementById('videoTag');
                    var mp4Vid = document.getElementById('sourceMP4');
                    var newSourceMP4=document.createElement("source");
                    var mp4Id=document.createAttribute("id");
                    var mp4Src=document.createAttribute("src");
                    var mp4Type=document.createAttribute("type");

                    videoTag.removeChild(sourceMP4);
                    parentVideoTag.removeChild(videoTag);
                    idVideo.value="videoTag";
                    controlsVideo.value="controls";
                    heightVideo.value="425px";
                    widthVideo.value="100%";
                    newVideoTag.setAttributeNode(idVideo);
                    newVideoTag.setAttributeNode(controlsVideo);
                    newVideoTag.setAttributeNode(heightVideo);
                    newVideoTag.setAttributeNode(widthVideo);
                    parentVideoTag.appendChild(newVideoTag);
                    mp4Id.value="sourceMP4";
                    mp4Type.value="video/mp4";
                    newSourceMP4.setAttributeNode(mp4Id);
                    newSourceMP4.setAttributeNode(mp4Src);
                    newSourceMP4.setAttributeNode(mp4Type);
                    newVideoTag.appendChild(newSourceMP4);

                    //change of the video source
                    player.pause();

                    //Now simply set the 'src' property of the mp4Vid webmVid et ogvVid variable
                    //Source paths for the html video tag
                      mp4Vid.src = '/api/videos/'+uniqueName+'/play/'+tok+'/mp4';
                    player.load();

                    $scope.videoLue = [
                        {
                            sources: [
                                {src: $sce.trustAsResourceUrl(path), type: "video/mp4"||$sce.trustAsResourceUrl(path), type: "video/ogv"||$sce.trustAsResourceUrl(path), type: "video/webm"}
                            ]
                        }
                    ];
                    $scope.controller.config = {
                        preload: "none",
                        autoHide: false,
                        autoHideTime: 3000,
                        autoPlay: true,
                        sources: $scope.videoLue[0].sources,
                        theme: {
                            url: "vendors/videogular/videogular.css"
                        },
                        plugins: {
                            poster: ""
                        }
                    };
                }
            );

            /*We load the other videos of the citizen reporter*/
            categ=JSON.stringify([]);
            tags=JSON.stringify([]);
                servicesAPI.getVideos(0,categ,tags,"DESC",'USER',$scope.selectedVideo.person.email, '').success(function(data){
                    $scope.reporterVideos = data;
                     $scope.dataLoading.userBids = true;
                    setTimeout(function(){
                        $(".shader").hover(function(){
                            var color = rainbow();
                            $(this).css('background-color', 'rgba(' + color + ')' );

                        });
                            console.log($scope.reporterVideos);
                        for(var vid in $scope.reporterVideos) {
                            var uniqueName = $scope.reporterVideos[vid].unique_name;
                            var $reporterVid = $("#reporterVideo" + uniqueName);
                            var path = '../api/videos/' + uniqueName + '/thumbnail';
                            $reporterVid.css('background-image', "url(" + path + ")" ).css('background-size','100% 100%');
                        }
                        initMapBySelector({ lat: videoPlanCoordinates[0].lat, lng: videoPlanCoordinates[0].lng }, "#mapSelectedVideo", 15, {geodesic:true},[]);
                    },50);

                });
            setTimeout(false);
            initViewCountIncrementOnVideoClick();
            initAuctionButtonClick();
            initAuctionInputStep();
        }

        $scope.returnToVideosList=function(){
            $window.location.reload();
        }

        $scope.alreadyMadeBid = function() {
            return $scope.selectedVideo != undefined && $scope.selectedVideo.auction != undefined && $scope.selectedVideo.auction.my_last_value != undefined;
        }

        $scope.hasHighestBid = function() {
            return $scope.selectedVideo.auction != undefined && $scope.selectedVideo.auction.highestBid == $scope.selectedVideo.auction.my_last_value
        }

        $scope.showAuctionBidVideo = function(index) {
            return $scope.userBidVideos[index].video[0].auction.end > new Date().getTime();
        };

        /*Function that determine the current browser of the user*/
        function browserDetection(userAgent){
            var browsers = {ie: /trident/i, edge: /edge/i, opera: /opera/i, firefox: /firefox/i, chrome: /chrome/i, safari: /safari/i};

            for(var key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
           };
        }

        function toStandardCase(string) {
            return string[0].toUpperCase() + string.substr(1).toLowerCase();
        }

        function initViewCountIncrementOnVideoClick(){
            var $mediaplayer = $("#mediaplayer");

            $mediaplayer.unbind('click');
            $mediaplayer.click(function(clickEvent){
                $mediaplayer.unbind('click');
                var videoUniqueName = $scope.selectedVideo.unique_name;
                servicesAPI.incrementVideoViewCount(videoUniqueName).then(
                    function(resp){
                        updateViewCountArrays(videoUniqueName);
                    },
                    function(err){
                        console.log(err);
                    }
                );
            });
        }

        function initAuctionButtonClick() {
            $submitAuctionBtn = $("#submitAuctionBtn");
            $submitAuctionBtn.unbind();
            $submitAuctionBtn.click(function(){

                var bidAmount = $("#auction-amount-input").val();
                var maxBidAutoAmount = $("#auction-amount-max-auto-input").val();
                var videoUniqueName = $scope.selectedVideo.unique_name;
                var auction = $scope.selectedVideo.auction;

                if(isNaN(bidAmount) || isNaN(maxBidAutoAmount)){
                    console.log("Amounts must contain numeric characters.");
                    return;
                }

                if(maxBidAutoAmount == "")
                    maxBidAutoAmount = 0;

                if(bidAmount == "")
                    amount = 0;

                if(auction == undefined){
                    servicesAPI.createAuction(videoUniqueName, bidAmount).then(
                        function(resp){

                            var startTime = new Date();
                            var endTime = new Date();
                            endTime.setHours(startTime.getHours() + 4);

                            $scope.currentOffer = bidAmount;
                            $scope.initialMinimum = parseInt(bidAmount) + 50;
                            $scope.selectedVideo.auction = {
                                end : endTime,
                                start : startTime,
                                highestBid: bidAmount,
                                media: $scope.selectedVideo.person.media_agent.media.name
                            };
                            $scope.userBidVideos.push({
                                bidAmountInitial: bidAmount,
                                bidCurrentAmount: bidAmount,
                                bidDateTime: new Date().getTime(),
                                bidMaximumAmount: null,
                                video: [$scope.selectedVideo]
                            });
                            $scope.remainingTime = '3:59:59';
                            auctionTimeout = $interval(function(){
                                setAuctionCountdown(auctionTimeout);
                            },1000);

                        },
                        function(err){
                            console.log(err);
                        }
                    );
                }else{
                    servicesAPI.makeABid(videoUniqueName, bidAmount, maxBidAutoAmount).then(
                        function(resp){

                            var lastBid = $scope.selectedVideo.auction.my_last_value || 0;
                            var index = findIndexByUniqueName(videoUniqueName, $scope.userBidVideos);

                            $scope.currentOffer = bidAmount;
                            $scope.selectedVideo.auction.my_last_value = bidAmount;
                            $scope.initialMinimum = parseInt(bidAmount) + 50;

                            if(index !== undefined) {
                                $scope.userBidVideos[index].bidCurrentAmount = bidAmount;
                                $scope.userBidVideos[index].video[0].auction.highestBid = bidAmount;
                            } else {
                                $scope.userBidVideos.push({
                                    bidAmountInitial: bidAmount,
                                    bidCurrentAmount: bidAmount,
                                    bidDateTime: new Date().getTime(),
                                    bidMaximumAmount: null,
                                    video: [$scope.selectedVideo]
                                });
                            }

                            $scope.creditsLeft -= (bidAmount - lastBid);
                        },
                        function(err){
                            console.log(err);
                        }
                    );
                }
            });
        }

        function loadLastCategory() {
            $("#" + prefLoader.getCookie('last_category')).trigger('click');
        }

        function initAuctionInputStep() {
            $scope.initialMinimum = ($scope.selectedVideo.auction != undefined ? $scope.selectedVideo.auction.highestBid + 50 : 50);
            $amountAuctionInput = $("#auction-amount-input");
            $amountAuctionInput.val('');
            $("#auction-amount-max-auto-input").val('');
            $amountAuctionInput.attr('min', ($scope.selectedVideo.auction !== undefined) ? $scope.selectedVideo.auction.highestBid + 50 : 50);
        }

        function setAuctionCountdown(state){
            var auction = $scope.selectedVideo.auction;
            var timeleft;
            if( auction !== undefined ) {
                var timeleft = auction.end - new Date();

                if( timeleft < 0 ){
                    $interval.cancel(state);
                    return; //auction ended
                }

                $times = $("#time2-" + $scope.selectedVideo.unique_name);
                var hours = Math.floor(timeleft / (60 * 60 * 1000));
                var mins = Math.floor(timeleft / (60 * 1000) % 60);
                var secs = Math.floor((timeleft / 1000) % 60);
                if( mins < 10 )
                    mins = '0' + mins;
                if( mins < 5 && hours == 0 )
                    $times.addClass('remaining-time');
                else {
                    if($times.hasClass('remaining-time')) $times.removeClass('remaining-time');
                }

                if( secs < 10 )
                    secs = '0' + secs;

                time =  hours + ':' + mins + ':' + secs;

                $scope.remainingTime = time;
            }
        }

        function findIndexByUniqueName(videoUniqueName, videoList){
            for(var i = 0; i < videoList.length; ++i){
                var bid = videoList[i].video;
                var vid;
                if(bid != undefined)
                    vid = bid[0];
                else
                vid = videoList[i];
                if(vid.unique_name === videoUniqueName){
                    return i;
                }
            }
        }

        function selectLangTranslationIndex(lang) {
            switch(lang) {
                case "EN" : return 0;
                case "FR" : return 1;
            }
        }

        function updateViewCountArrays(videoUniqueName){

            var actualViewCount = $scope.selectedVideo.times_viewed;
            var index = findIndexByUniqueName(videoUniqueName, $scope.recentVideos);
            console.log($scope);
            if(index != undefined){
                $scope.recentVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.nearEndAuctionVideos)
            if(index !== undefined) {
                $scope.nearEndAuctionVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.reporterVideos);
            if(index != undefined){
                $scope.reporterVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.mostViewedVideos);
            if(index != undefined){
                $scope.mostViewedVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.highestBidVideos);
            if(index != undefined){
                $scope.highestBidVideos[index].times_viewed += 1;
            }

            if(actualViewCount + 1 != $scope.selectedVideo.times_viewed)
                $scope.selectedVideo.times_viewed += 1;
        }

        /*Function that intialize the google map for the media bombs*/
        function initMapBySelector(coordinates, mapSelector, zoom, mapConfig, geolocationMediaAgent) {
            var mapElem = $(mapSelector)[0];//COMMENT RECUPERER VALEUR DE CE TRUC ???????
            //var posCenter=coordinates;
            //alert(mapElem.value)
            var map = new google.maps.Map(mapElem, {
                zoom : zoom,
                center: {lat:coordinates.lat, lng:coordinates.lng},
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

            if(mapSelector=="#map"){

                var infoWindow = new google.maps.InfoWindow({map: map});
                circleColor = '#81BEF7';
                var circleOption = {
                 strokeColor: circleColor,
                 strokeOpacity: 0.8,
                 strokeWeight: 2,
                 fillColor: circleColor,
                 fillOpacity: 0.35,
                 map: map,
                 clickable:false,
                 center: {lat:coordinates.lat, lng:coordinates.lng},
                 radius: 10000
                  };

                  if(geolocationMediaAgent=="failureLocalization"){
                      alert("Problème de localisation de l'agent média")
                  }else {
                  circle = new google.maps.Circle(circleOption);

                  infoWindow.setPosition({lat:coordinates.lat, lng:coordinates.lng});
                  if(geolocationMediaAgent=="geoLocalized"){
                      infoWindow.setContent('You are currently here.');
                  }
                  if(geolocationMediaAgent=="homeLocalized"){
                      infoWindow.setContent('Immediate localization is not allowed by the browser. Here is your office.');
                  }
                  map.setCenter(coordinates);
                }



                /*We put the blue round to mark the exact position of the media agent*/
                var iconBase = 'resources/images/';
                var icons = {
                  currentPosition: {
                    icon: iconBase + '32.png'
                  }
                };
                var markeri = new google.maps.Marker({
                map: map,
                position: {lat:coordinates.lat, lng:coordinates.lng},
                icon: icons.currentPosition.icon
                //map_icon_label: '<span class="map-icon map-icon-point-of-interest"></span>'
            });
                markeri.setMap(map);
                /*We add the markers corresponding to the recent videos*/
                for(var i=0;i<$scope.recentVideos.length;i++){
                    var lattitudeAverage=0;
                    var longitudeAverage=0;
                    var nbVideoCoordinates=$scope.recentVideos[i].gps_coordinates.length;

                    for(var j=0;j<nbVideoCoordinates;j++){
                        lattitudeAverage+=$scope.recentVideos[i].gps_coordinates[j].latitude;
                        longitudeAverage+=$scope.recentVideos[i].gps_coordinates[j].longitude;
                    }
                    lattitudeAverage=lattitudeAverage/nbVideoCoordinates;
                     longitudeAverage=longitudeAverage/nbVideoCoordinates;

                     var marker = new google.maps.Marker({
                    position: {lat:lattitudeAverage, lng:longitudeAverage},
                    title:$scope.recentVideos[i].name
                    });

                    // To add the marker to the map, call setMap();
                    marker.setMap(map);


                 }


            }

            var config = new google.maps.Polyline(mapConfig);

            config.setMap(map);
        }

        function initMaps(mapObjects) {
            for( var map in mapObjects) {
                initMapBySelector(mapObjects[map].coordinates, mapObjects[map].selector, mapObjects[map].zoom, mapObjects[map].config,[]);
            }
        }

        function toggleNotificationView( msg, msgType ) {

            var modal = $modal.open({
                templateUrl: 'resources/views/homeMedia/notificationModal.html',
                backdrop: 'static',
                dialogFade: true,
                controller: 'notificationController',
                resolve: {
                    message: function() {
                        return {
                            msg: msg,
                            msgType: msgType
                        };
                    }
                }
            });

        }

        function mediaAgentGeolocalisation(){

            /*if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                    };
                    initMapBySelector(pos, "#map", 9, {geodesic:true},"geoLocalized");// the media agent's device has effectively been localized

                    //alert(JSON.stringify(res[0]));

                })

            }else{*/
                var address='';
                servicesAPI.getCurrentMediaAgent().success(function(data){
                    data = data.user;
                    address+=data.localization.street.replace(/ /g,"+");
                    address+=',+';
                    address+=data.localization.city.replace(/ /g,"+");
                    address+=',+';
                    address+=data.localization.country_fips.replace(/ /g,"+");
                    //alert(address);
                    servicesAPI.getMediaAgentHomeCoordinates(address).success(function(data){
                    var homeCoordinates=data.results[0].geometry.location;

                    //alert(JSON.stringify("ghjklm"+data.results.geometry))
                    //$scope.azertyuiop=JSON.stringify(data.results[0].geometry);
                    initMapBySelector(homeCoordinates, "#map", 9, {geodesic:true},"homeLocalized");// the media agent's device has not effectively been localized but home is found
                })
                }).error(function(){
                    initMapBySelector({lat:0, lng:0}, "#map", 0, {geodesic:true},"failureLocalization");//neither the instantaneous nor the home localization worked
                    location.href = "../";
                });


            //}
            //alert("ghjklm"+res)
            //return res;
        }
        /*servicesAPI.getCurrentMediaAgent().success(function(data){
            alert(JSON.stringify(data));
        });*/
    });
