;( function( video911App, window, undefined ) {

    "use strict";

    video911App.factory( "video911Factory", function( $http, $location ) {

        var videoFactory = {
            registerLoadEvent: registerLoadEvent,
            triggerRegisteredEvent: triggerRegisteredEvent
        };

        /* PUBLIC FUNCTIONS */

        function registerLoadEvent(eventName, callback) {
            (function(eventName){
                $(window.document).on(eventName, function(e, data){
                    callback(data);
                });
            })(eventName);
        }

        function triggerRegisteredEvent(eventName, data) {
            $(window.document).trigger(eventName, data);
        }


        /* INITIALIZATION ROUTINE */
        init($http);


        function getVideos() {
            return videoFactory.videos;
        }

        function init($http) {

            $http({ withCredentials: true, method: 'GET', url: '/api/911videos' }).then(function(resp) {
                triggerRegisteredEvent('video911DataLoaded', resp);
            });

            $http({ withCredentials: true, method: 'GET', url: '/api/911videos/related' }).then(function(resp) {
                triggerRegisteredEvent('noTokenVideosLoaded', resp);
            });

        }


        return videoFactory;
    } );

} )( video911App, window );
