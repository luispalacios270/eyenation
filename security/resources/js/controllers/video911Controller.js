;
(function (video911App, $, window, undefined) {

    "use strict";

    video911App.controller("video911Controller", ['$scope', '$rootScope', 'securityDelegateFactory', 'video911Factory', 'API911video', '$state', function ($scope, $rootScope, securityDelegateFactory, video911Factory, API911video, $state) {

        $scope.videos = {
            videos911: [],
            noTokenVideos: []
        };
        $scope.selectedVideo = undefined;
        $scope.connectedUser = {};
        $scope.videos911Index = 0;
        $scope.videos911Limit;
        $scope.noTokenVideosIndex = 0;
        $scope.noTokenLimit = 0;

        var dataLoaded = false;
        var widthcalculated = false;

        $scope.load911Categories = function () {

            API911video
                .getCategories()
                .success(function (rs) {
                    console.log(rs, "categorys");
                    $scope.categorys = rs;
                })

        }

        $scope.load911videos = function () {

            API911video
                .getVideos()
                .success(function (rs) {
                    $scope.videos = rs;
                    console.log(rs, "videos")
                })

        }

        $scope.goToVideo = function () {

            $state.go('video911', {
                video: this.video,
                id: this.video.unique_name
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
    }]);

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