angular.module('base.home', ['ngRoute', 'base.services'])
	/*
	 * Define routing and views.
	 */
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
		when("/", {
			templateUrl: "resources/views/home/home.html",
			controller: "homeController"
		});
	}])
	.controller('homeController', function ($scope, servicesAPI, $cookies, $location, $interval) {
		if ($location.path() != '#/login') {
			location.href = '#/login';
		}



		angular.element(document).ready(function () {
			$('.info-slick').slick({
				dots: true,
				infinite: true,
				speed: 500,
				fade: true,
				cssEase: 'linear',
				autoplay: true
			});
		})

		adjustScreen();

		$("#fakeBody").addClass('loaded');
		$(".over-shade-content").css('display', 'block');
		$(".bottom-menu").css('display', 'block');
		$("#loading").css('display', 'none');

		$("#anim").click(function () {
			$("#cover").addClass('anima');
		});

		$(window).scroll(function (event) {

			$bottomMenu = $(".bottom-menu");
			var scroll = $(window).scrollTop();
			var pageHeight = $("main").height() - $bottomMenu.height();

			if (scroll >= pageHeight)
				$bottomMenu.addClass('fixed-top-menu');

			if (scroll <= pageHeight && $bottomMenu.hasClass('fixed-top-menu'))
				$bottomMenu.removeClass('fixed-top-menu').addClass('bottom-menu');
		});

		$(window).resize(adjustScreen);

		function adjustScreen() {
			$("#coverSlider").css('height', $("#text").height() + $("#text-header").height() + $("#anim").height() + $(".imgs").height() + 30);
			$("#cover").css('height', $("#text").height() + $("#text-header").height() + $("#anim").height() + $(".imgs").height() + 30);
			$("#cover-shader").height($("#text").height() + $("#text-header").height() + $("#anim").height() + $(".imgs").height() + 30);
		}

		new WOW().init();

		$scope.user = {};
		$scope.validateLoginFor = function (user, event) {

			event.preventDefault();

			var xAuthType;
			if (user.name && user.pwd)
				xAuthType = 0; //user.name.indexOf("@") !== -1 ? "1" : "0" ;
			else
				return;

			var connectString = btoa(user.name + ':' + user.pwd);

			servicesAPI.authenticate(connectString, xAuthType).then(function (user) {
				if (user !== undefined) {
					// location.href = '/hosting';
					location.href = '/hosting/#/videoViewer';
				}
			}, function (err) {
				console.log(err);
				// $("#err").css('display', 'block');
				$("#err").show(300);
				$interval(function () {
					$("#err").hide(300);

				}, 5000, 1);
			});
		};
		if ($cookies.get("e-session")) {
			servicesAPI.verifAuthentifie(function (call) {
				call.success(function (resp) {
					// if (resp !== undefined && resp.localization)
					// location.href = '/hosting/#/videoViewer';
				});
			});
		}


		// Object placeholder for form parameters.
		// $scope.user = {};
		$scope.paysList = {};
		$scope.langueList = {};
		$scope.states = [];

		//Check if the user is deconnected to access the page of creation
		//This page must be only accessible if no session is active
		var cookie = $cookies.get("e-session");
		if (cookie) {
			// $location.path("/home");
			// location.href = '/hosting/#/videoViewer';
		} else {
			$scope.showSignupBox = true;
		}

		servicesAPI.getCountries().then(function (data) {
			console.log("Countries", data.data);
			data = data.data;
			$scope.paysList = data;
		}, function (err) {
			console.log("Error", err);
			// alert("Erreur chargement des pays");
		});

		servicesAPI.recupLangues().then(function (data) {
			data = data.data;
			$scope.langueList = data;
		}, function (err) {
			console.log("Error", err);
			// alert("Erreur chargement des langues");
		});

		$scope.getStatesByCurrentCountry = function () {
			// Validate if current country is set.
			if (!$scope.user.country) {
				return [];
			}

			// var country = $scope.paysList[$scope.user.country];

			// Check if chosen country exists or has states.
			// if (!country || !country.states) {
			// 	return [];
			// }

			// Return country states
			servicesAPI.getStates($scope.user.country).then(function (data) {
				console.log("States", data);
				data = data.data;
				$scope.states = data.states;
				// $scope.langueList = data;
			}, function (err) {
				console.log("Error", err);
				// alert("Erreur chargement des langues");
			});

			// return country.states;
		}

		$scope.isFormValid = function (formName) {

			var form = $scope[formName];

			if (!form) {
				return false;
			}

			return form.$valid;
		}

		$scope.validate = function (user) {
			//reinitialization of error message concerning required fields

			$scope.nameAlreadyUsed = false;
			$scope.mailAlreadyUsed = false;
			$scope.countryNotChosen = false;
			$scope.stateNotChosen = false;
			$scope.languageNotChosen = false;
			$scope.nameLenghtNotValid = false;
			$scope.pwLengthNotValid = false;
			$scope.addressLengthNotValid = false;
			$scope.creationPb = false;
			$scope.confNotValid = false;
			$scope.telFormatInvalid = false;
			$scope.telExamples = "";

			// We verify if the username contain between 8 and 20 characters
			if (user.name.length != 0 && (user.name.length < 8 || user.name.length > 20)) {
				$scope.nameLenghtNotValid = true;
				return;
			}
			//We check if the password length is valid
			if (user.password.length < 4 || user.password.length > 16) {
				$scope.pwLengthNotValid = true;
				return;
			}
			//We check if the two typed password are equal
			if (user.password != user.confirmationPw) {
				$scope.confNotValid = true;
				return;
			}

			//We check if the telephone format is valid
			// var pattern = $scope.paysList[user.country].phonePattern;
			var phoneEntered = user.telephone;
			var res = phoneEntered.split(" ").join('')
			// var re = new RegExp($scope.paysList[user.country].phonePattern)
			/*if (res.match(re) == null) {
				$scope.telExamples = $scope.paysList[user.country].phoneExamples;
				$scope.telFormatInvalid = true;
				return;
			}*/

			//We check if the address length is valid
			if (user.address.length > 100) {
				$scope.addressLengthNotValid = true;
				return;
			}
			//Verifi if the country is selected
			if (user.country == undefined) {
				$scope.countryNotChosen = true;
				return;
			}
			//Verify if the state is selected
			if (user.state == undefined) {
				$scope.stateNotChosen = true;
				return;
			}
			//Verify if the language is selected
			if (user.language == undefined) {
				$scope.languageNotChosen = true;
				return;
			}

			//if the international indicatif of the phone, we add it in the registration in the DB
			/*var tel = "";
			if (res.match(re)[1] != $scope.paysList[user.country].indicatif) {
				tel = $scope.paysList[user.country].indicatif + res.match(re)[2];
			} else {
				tel = res;
			}*/
			var tel = res;

			// Case of a subscription without username
			if (user.name == undefined || user.name.length == 0) {


				servicesAPI.createHomeAccountName( //For the moment, we have to put the email for the username in that case
						user.email,
						user.password,
						user.email,
						user.firstname,
						user.lastname,
						tel,
						user.address,
						user.city,
						user.country,
						user.state,
						user.language)
					.then(function () {
						// $location.path("/");
						location.href = '/hosting/#/videoViewer';
						console.log("Usuario Creado");

					}, function (err) {
						console.log("error", err);
						$scope.creationPb = true;
					})

			} else { //Case of a subscription with a username

				servicesAPI.createHomeAccountName(
						user.name,
						user.password,
						user.email,
						user.firstname,
						user.lastname,
						tel,
						user.address,
						user.city,
						user.country,
						user.state,
						user.language)
					.then(function () {
						// $location.path("/");
						location.href = '/hosting/#/videoViewer';
						console.log("Usuario Creado");


					}, function (err) {
						console.log("error", err);
						$scope.creationPb = true;
					})


			}
		};
	});