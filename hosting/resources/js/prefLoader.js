angular.module('hosting.prefs', [])
  .factory('prefLoader', function ($http) {

        var prefLoader = {};

        prefLoader.currentLanguage = {};
        prefLoader.currentLanguage.menuOptions = {};
        prefLoader.currentLanguage.videoList = {};

        var language;

        prefLoader.changeLanguage = function(lang) {
            language = lang;
            prefLoader.setCookie('language', lang, 365);
            return prefLoader.getLanguage();
        }

        prefLoader.getLanguage = function() {

            return $http.get("vendors/" + language + "-Language.json");
        }

        prefLoader.getText = function() {
            return prefLoader.currentLanguage;
        }

        prefLoader.checkCookie = function(name){
            return prefLoader.getCookie(name) != "" ? true : false ;
        }

        prefLoader.getCookie = function(name) {
            var name = name + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length,c.length);
                    }
            }
            return "";
        }

        prefLoader.setCookie = function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000)); // (24*60*60*1000) millis --> 1 day
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + ';path=/';
        }

        //Statup Routine
        if(!prefLoader.checkCookie("language")){
            language = window.navigator.userLanguage || window.navigator.language;
            var indexOfDash = language.indexOf("-");
            if(indexOfDash != -1){
                language = language.substring(0, indexOfDash);
            }
            prefLoader.setCookie('language', language, 365);
        } else{
            language = prefLoader.getCookie("language");
        }

        return prefLoader;

  });
