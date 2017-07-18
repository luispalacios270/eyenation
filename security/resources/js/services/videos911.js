function video911($q, $http, API_BASE) {

    var APIbase = API_BASE;


    this.getVideos = function (data) {

        route = APIbase + "911videos/recents/2";

        return $http.get(route);

    }

    this.getCategories = function () {



        route = APIbase + "911videos/categories";

        return $http.get(route);


    }


    this.getNearVideos = function (meters, lat, lng) {

        route = APIbase + "911videos/near/" + meters + "/" + lat + "/" + lng;

        return $http.get(route);

    }

    this.Viewed = function (unique_name) {
        route = APIbase + "911videos/" + unique_name + "/viewed";

        return $http.post(route, {}, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    }

    return this;



}


function vFromNumber($q, $http, API_BASE) {
    var APIbase = API_BASE;
    this.get = function (number) {
        // route = APIbase + "911videos/from-number/" + number + "/2";
        route = APIbase + "911videos/lastVideosOf/" + number;
        return $http.get(route);
    }
    return this;
}


angular.module('911Video')
    .service('API911video', video911);

angular.module('911Video')
    .service('APIvideoFromNumber', vFromNumber);