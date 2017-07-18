;(function(window, document, $,  undefined) {

    "use strict";

    var VideoModule = {};

    VideoModule = (function(VideoModule, $) {

        return VideoModule.VideoObject = ( function($) {

            function VideoObject(videoJSON) {

                console.log(videoJSON);
                var name = videoJSON.name;
                var uniqueName = videoJSON.unique_name;
                var timeCreated = videoJSON.stream_startedon;
                var person = videoJSON.person;
                var status = videoJSON.status;
                var tags = videoJSON.tags;
                var coords = videoJSON.gps_coordinates;
                var timesViewed = videoJSON.times_viewed;

                this.getName = function getName() {
                    return name;
                };

                this.getUniqueName = function getUniqueName() {
                    return uniqueName;
                };

                this.getCreationTime = function getCreationTime() {
                    return timeCreated;
                };

                this.getStatus = function getStatus() {
                    return status;
                };

                this.getVideoThumbnailUrl = function getVideoThumbnailUrl() {
                    return getThumbnailResourceUrl();
                };

                this.getCoordinates = function getCoordinated() {
                    return coords[0];
                }

                this.addSource = function addSource(container) {
                    getVideoSourceUrl(function(path) {
                        var $src = $("<source>");
                        $src.attr("src", path);
                        $(container).append($src);
                    });
                };

                /* Privates functions*/
                function getThumbnailResourceUrl() {
                    return '../api/videos/' + uniqueName + '/thumbnail';
                }

                function getViewingToken(callback) {
                    $.get( '/api/videos/' + uniqueName + '/play', callback);
                }

                function getVideoSourceUrl(callback) {
                    return getViewingToken(function(data) {
                        var token = JSON.parse(data).viewing_token;
                        callback('../api/videos/' + uniqueName + '/play/' + token + '/mp4');
                    });
                };

                return this;
            }

            return {VideoObject : VideoObject};
        } )($);

    })(VideoModule, $);

    document.VideoModule = VideoModule;

})(window, document, $);
