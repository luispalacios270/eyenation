;
(function (video911App, $, window, undefined) {

    "use strict";


    video911App.directive('dlEnterKey', function () {
        return function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {
                var keyCode = event.which || event.keyCode;

                // If enter key is pressed
                if (keyCode === 13) {
                    scope.$apply(function () {
                        // Evaluate the expression
                        scope.$eval(attrs.dlEnterKey);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    video911App.controller("video911Controller", ['$scope', '$rootScope', 'securityDelegateFactory', 'video911Factory', 'API911video', '$state', 'NgMap', '$window', '$timeout', '$sce', '$mdDialog', 'APIuser',
        function ($scope, $rootScope, securityDelegateFactory, video911Factory, API911video, $state, NgMap, $window, $timeout, $sce, $mdDialog, APIuser) {

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

            APIuser.getSecurityUser().then(function (data) {
                data = data.data;
                $scope.user = data;
                console.log("USER SECURITY ", data)
            }, function (err) {
                console.log(err)
            })

            $scope.lives = [];
            var SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
            var STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;
            var remoteVideo;
            var resolution_for_wsplayer;
            var stream;
            var currentVolumeValue = 50;

            var autoplay = false;
            var resolution = null;
            var mediaProvider = null;
            remoteVideo = document.getElementById("local");

            //init api
            try {
                Flashphoner.init({
                    flashMediaProviderSwfLocation: 'vendors/flashphoner/media-provider.swf',
                    receiverLocation: 'vendors/flashphoner/examples/demo/dependencies/websocket-player/WSReceiver2.js',
                    decoderLocation: 'vendors/flashphoner/examples/demo/dependencies/websocket-player/video-worker2.js',
                    preferredMediaProvider: mediaProvider
                });
            } catch (e) {
                console.log("error", e)
                return;
            }

            if (Flashphoner.getMediaProviders()[0] == "WSPlayer") {
                resolution_for_wsplayer = {
                    playWidth: 640,
                    playHeight: 480
                };
            }

            $scope.goToSource = function (videoCoordinates) {
                $root.userLocation = "[" + videoCoordinates.latitude + "," + videoCoordinates.longitude + "]";
            }

            $scope.showLiveStream = function (ev) {
                // jQuery("#stream").modal("show");
                $mdDialog.show({
                    contentElement: '#live-modal',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });

                $scope.start(this.live.ws_url)
            }

            $scope.hideModal = function () {
                $mdDialog.hide();
            }

            $scope.hideStream = function () {

                if (stream) {
                    stream.stop();
                    $scope.isLoaded = false;
                }

                // jQuery("#stream").modal("hide");
                $mdDialog.hide();
            }

            $scope.start = function (url) {

                if (Flashphoner.getMediaProviders()[0] == "WSPlayer") {
                    // Flashphoner.playFirstSound();
                }

                //create session
                var server = url.split('/')[0] + '//' + url.split('/')[2];
                console.log("SERVER", server);
                var streamName = url.split('/')[3];

                console.log("STREAM_NAME", streamName);
                console.log("server:", server)
                console.log("stream:", streamName)
                console.log("renderOn", remoteVideo)


                if (window.location.protocol == "http:") {
                    var url = server.replace("wss://", "ws://");
                    url = url.replace(":8443", ":8080");
                    server = url;
                }


                if (Flashphoner.getSessions().length > 0) {

                    var session = Flashphoner.getSessions()[0];

                    if (session.getServerUrl() != server) {
                        //remove session DISCONNECTED and FAILED callbacks
                        session.on(SESSION_STATUS.DISCONNECTED, function () {});
                        session.on(SESSION_STATUS.FAILED, function () {});
                        session.disconnect();

                    } else {

                        $scope.playStream(session, streamName);
                        return;

                    }

                }

                Flashphoner.createSession({
                    urlServer: server
                }).on(SESSION_STATUS.ESTABLISHED, function (session) {
                    console.log("session", session);
                    console.log("status", session.status())

                    //session connected, start playback
                    $scope.playStream(session, streamName);

                }).on(SESSION_STATUS.DISCONNECTED, function () {
                    //setStatus(SESSION_STATUS.DISCONNECTED);
                    //onStopped();
                }).on(SESSION_STATUS.FAILED, function () {
                    //setStatus(SESSION_STATUS.FAILED);
                    //onStopped();
                });





            }

            $scope.playStream = function (session, streamName) {

                var options = {
                    name: streamName,
                    display: remoteVideo
                };

                if (resolution_for_wsplayer) {
                    options.playWidth = resolution_for_wsplayer.playWidth;
                    options.playHeight = resolution_for_wsplayer.playHeight;
                } else if (resolution) {
                    options.playWidth = resolution.split("x")[0];
                    options.playHeight = resolution.split("x")[1];
                }

                stream = session.createStream(options).on(STREAM_STATUS.PLAYING, function (stream) {

                    $timeout(function () {
                        $scope.isLoaded = true;
                    }, 5000);

                    $scope.$apply();

                }).on(STREAM_STATUS.STOPPED, function () {
                    console.log("stoped");
                    //setStatus(STREAM_STATUS.STOPPED);
                    //onStopped();
                }).on(STREAM_STATUS.FAILED, function () {
                    //setStatus(STREAM_STATUS.FAILED);
                    //onStopped();
                    console.log("failed");

                }).on(STREAM_STATUS.NOT_ENOUGH_BANDWIDTH, function (stream) {
                    console.log("Not enough bandwidth, consider using lower video resolution or bitrate. Bandwidth " + (Math.round(stream.getNetworkBandwidth() / 1000)) + " bitrate " + (Math.round(stream.getRemoteBitrate() / 1000)));
                });

                stream.play();

            }

            $window.socket.on('stream::start', function (data) {
                console.log("stream::start", data)
                $scope.currentLive = data;
                //$scope.start(data.ws_url);
                $scope.lives.push(data)

                $scope.$apply();
            });

            $window.socket.on('stream::end', function (data) {
                console.log("stream::end", data);
                angular.forEach($scope.lives, function (live, index) {
                    if (live.ws_url === data.ws_url) {
                        $scope.lives.splice(index, 1);
                        $scope.$apply();
                        return;
                    }
                });
                data.isRecent = true;
                $scope.videos.push(data);
                $scope.hideStream();
                $scope.hideModal();
                $scope.$apply();
                $scope.goToSource(data.gps_coordenates[0]);
            });

            $scope.playRecordedVideo = function (video) {
                var _video = video;
                var myVideo = document.getElementById('mainVideo-' + this.$index);

                myVideo.onended = function (e) {
                    _video.show = false;
                    $scope.$apply()
                };

                this.video.show = true;

                myVideo.innerHTML = '';

                var extensions = ["webm", "mp4"];

                for (var x in extensions) {
                    var source = document.createElement("source");
                    source.src = this.video.recorded_video.replace(".mp4", '.' + extensions[x]);
                    source.type = "video/" + extensions[x];
                    $(myVideo).append(source);
                }

                myVideo.load();
                myVideo.play();
            }

            // $scope.address = "Current user location";
            $scope.address = "Please, input an address";

            $rootScope.$on('geolocation', function (ev, location) {
                console.log("and by right here")
                /*NgMap.initMap('Map');*/
            })

            /* $scope.videos = {
                 videos911: [],
                 noTokenVideos: []
             };*/
            $scope.selectedVideo = undefined;
            $scope.connectedUser = {};
            $scope.videos911Index = 0;
            $scope.videos911Limit;
            $scope.noTokenVideosIndex = 0;
            $scope.noTokenLimit = 0;

            var dataLoaded = false;
            var widthcalculated = false;
            $scope



            $scope.geocode = function () {

                /*jQuery.getJSON("http://maps.google.com/maps/api/geocode/json?address=" + $scope.address.replace(/\s/g, "+"), function (data) {
                    console.log(data);
                    if (data.results.length === 0) {
                        alert("Sorry we can't find your address");
                        return;

                    } else {
                        var coors = data.results[0].geometry.location;
                        if (!coors) {
                            alert("Sorry we can't find your address");
                            return;
                        }
                        $rootScope.userLocation = coors.lat + "," + coors.lng;                    
                    }

                });*/

            }

            $scope.load911Categories = function () {

                API911video
                    .getCategories()
                    .then(function (rs) {
                        rs.data;
                        console.log(rs, "categorys");
                        $scope.categorys = rs;
                    })

            }

            $scope.load911videos = function () {

                API911video
                    .getVideos()
                    .then(function (rs) {
                        rs = rs.data;
                        $scope.videos = rs;
                        console.log(rs, "videos")
                    })

            }



            $scope.goToVideo = function (vid) {
                console.log(vid, "Other way")
                var video = vid || this.video;
                console.log(video);
                $state.go('video911', {
                    id: video.unique_name,
                    lat: video.gps_coordinates[0].latitude,
                    lng: video.gps_coordinates[0].longitude
                })

            }

            /*


            video911Factory.registerLoadEvent('video911DataLoaded', function(resp) {
                var videos = resp.data;
                for(var vid in videos) {
                    var newVideo = new window.document.VideoModule.VideoObject(videos[vid]);
                    $scope.videos.videos911.push(newVideo);
                }
                $scope.videos911Limit = parseInt($scope.videos.videos911.length / 5);
                initVideoSlider("#c911", "videos911");
            });

            video911Factory.registerLoadEvent('noTokenVideosLoaded', function(resp) {
                var videos = resp.data;
                for(var vid in videos) {
                    var newVideo = new window.document.VideoModule.VideoObject(videos[vid]);
                    $scope.videos.noTokenVideos.push(newVideo);
                }
            });

            */

            $scope.viewVideo = function (index, arrayName) {
                $scope.selectedVideo = $scope.videos[arrayName][index];
                console.log($scope.selectedVideo.getName());
            };

            $scope.moveForward = function (array) {
                var list = $scope.videos[array];
                var listLength = list.length;

                console.log($scope.videos911Index);
                console.log($scope.videos911Limit);

                if ($scope.videos911Index >= $scope.videos911Limit)
                    return;

                ++$scope.videos911Index;
                scrollLeft("#scroller", "-=" + 5 * 250, "videos911");
            };

            $scope.moveBackward = function (array) {
                var list = $scope.videos[array];
                var listLength = list.length;

                console.log($scope.videos911Index);
                console.log($scope.videos911Limit);

                if ($scope.videos911Index < 1)
                    return;

                --$scope.videos911Index;
                scrollLeft("#scroller", "+=" + 5 * 250, "videos911");
            };

            function scrollLeft(selector, movement, array) {
                console.log(movement);
                $(selector).animate({
                    opacity: 0.25
                }, 50, function () {
                    $(this).animate({
                        left: movement
                    }, 750, function () {
                        $(this).animate({
                            opacity: 1
                        });
                    });
                });
            }

            function initVideoSlider() {
                const SHOWING = 5;
                var nbVids = $scope.videos.videos911.length;
                var width;

                if (nbVids < SHOWING)
                    width = "100%";

                width = "calc(" + nbVids + " * " + " 300px " + " + " + nbVids + " * " + " 1em)";
                $("#c911").find(".carousel-content").find(".overflow-box").css('width', width);
                console.log(width);
            }
            initUI();
            $scope.load911videos();
        }
    ]);

    function initUI(scope) {
        initDrawerButton();

    }


    function initDrawerButton() {

        var $drawerBtn = $('#drawerIcon');

        $drawerBtn.on('click', function (e) {
            e.preventDefault();
            var $drawerWindow = $("#drawerInstance");
            var $btnSpan = $drawerBtn.find("span");
            var drawerIsOpen = $drawerWindow.hasClass("drawer-opened");

            if (drawerIsOpen) {
                $drawerWindow.removeClass("drawer-opened").addClass("drawer-closing");
                $btnSpan.removeClass("w3-signal-red").removeClass("w3-hover-vivid-blue").removeClass("opening-transition")
                    .addClass("w3-vivid-blue").addClass("w3-hover-signal-red");
            } else {
                $drawerWindow.removeClass("drawer-closing").addClass("drawer-opened");
                $btnSpan.removeClass("w3-vivid-blue").removeClass("w3-hover-signal-red")
                    .addClass("w3-signal-red").addClass("w3-hover-vivid-blue").addClass("opening-transition");
            }
        });
    }

})(video911App, jQuery, window);