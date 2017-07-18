var videoModule = angular.module('hosting.video', ['ngRoute', 'hosting.services', 'ngCookies', 'ngTagsInput', "ngSanitize", "hosting.prefs",
		"com.2fdevs.videogular",
		"com.2fdevs.videogular.plugins.controls",
		"com.2fdevs.videogular.plugins.overlayplay",
		"com.2fdevs.videogular.plugins.poster",
		"com.2fdevs.videogular.plugins.buffering",
		'ui.bootstrap',
		'ngMaterial',
		'ngMessages',
		'ngAnimate',
		'angular-svg-round-progressbar',
		'ngMap',
		'ngFitText',
		'md.data.table'

		/*,
				'ui.router.stateHelper'*/
	])
	/*
	 * Define routing and views.
	 */
	.config(['$routeProvider', function ($routeProvider, $locationProvider) {
		$routeProvider
			.when("/videoViewer", {
				templateUrl: "resources/views/video/videoViewer.html",
				controller: "listVideosController"
			})
			.when("/videoViewerAuctions", {
				templateUrl: "resources/views/video/videoViewerAuction.html",
				controller: "listVideosController"
			});
	}])
	/*	.config(['$stateProvider', function ($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state("videoViewer", {
					templateUrl: "resources/views/video/videoViewer.html",
					controller: "listVideosController"
				})
				.state("videoViewer.myVideos", {
					templateUrl: "resources/views/video/templates/myVideos.html",
					controller: "listVideosController"
				})
				.state("videoViewer.myAuctions", {
					templateUrl: "resources/views/video/templates/myAuction.html",
					controller: "listVideosController"
				});
		}])*/
	.config(['$httpProvider', function ($httpProvider) {
		//initialize get if not there
		if (!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {};
		}

		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT'; //disable IE ajax request caching
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}])
	.directive('myEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if (event.which === 13) {
					scope.$apply(function () {
						scope.$eval(attrs.myEnter);
					});
					event.preventDefault();
				}
			});
		};
	})
	.filter('sortBy', function () {
		return function (videos, criteria, reverse) {

			var comparedParam;
			var tmpList;

			switch (criteria) {
				case "title":
					comparedParam = "name";
					break;
				case "amount":
					comparedParam = "highestBid";
					tmpList = "auction";
					break;
				case "endAuctionDate":
					comparedParam = "end";
					tmpList = "auction";
					break;
				case "creationDate":
					comparedParam = "streaming_startedon";
					break;
			}

			var my_sort = function (a, b) {
				if (tmpList !== undefined) {
					if (a[tmpList] !== undefined && b[tmpList] !== undefined) {
						if (a[tmpList][comparedParam] > b[tmpList][comparedParam])
							return 1;
						if (a[tmpList][comparedParam] < b[tmpList][comparedParam])
							return -1;
						return 0;
					}
				} else {
					if (a[comparedParam] > b[comparedParam] || a[comparedParam] === "")
						return 1;
					if (a[comparedParam] < b[comparedParam] || b[comparedParam] === "")
						return -1;
					return 0;
				}
			};

			if (reverse)
				videos.sort(my_sort).reverse();
			else
				videos.sort(my_sort);

			return videos;
		}
	})

	.controller('auctionConfirmationModalController', function ($scope, $modalInstance, message, servicesAPI) {

		var video = message.video;
		var auction = video.auction;
		var uniqueName = video.unique_name;
		var addingToAuction = message.addingToAuction;

		$scope.confirmAuctionning = function () {
			servicesAPI.toAuction(uniqueName, addingToAuction).then(
				function (response) {
					message.updateVideoStatus(addingToAuction === true ? 'AUCTION' : 'READY');
				},
				function (error) {
					console.log(error);
				});

			$modalInstance.close('close');
		}

		$scope.close = function () {
			$modalInstance.close('close');
		}
	})
	.controller("auctionViewingController", function ($scope, $modalInstance, message, servicesAPI) {

		var vid = message.video;
		$scope.hasAuction = vid.auction === undefined ? false : true;
		$scope.history = undefined;

		if ($scope.hasAuction) {

			servicesAPI.getVideoAuctionBidHistory(vid.unique_name).then(function (resp) {
				$scope.history = resp.data;
				for (var bid in $scope.history) {
					$scope.history[bid].bidDateTime = new Date($scope.history[bid].bidDateTime);
				}

				$scope.vidName = $scope.history[bid].video[0].name;
				setTimeout(function () {
					$("#bid-table").DataTable();
				}, 200);
			}, function (err) {
				console.log(err);
			});

		}

		$scope.bidTimeout = function () {
			if (vid.auction != undefined) {
				var timeleft = vid.auction.end - new Date();
				if (timeleft < 0) {
					return '0:00:00';
				}

				var hours = Math.floor(timeleft / (60 * 60 * 1000));
				var mins = Math.floor(timeleft / (60 * 1000) % 60);
				var secs = Math.floor((timeleft / 1000) % 60);
				if (mins < 10)
					mins = '0' + mins;
				if (mins < 5 && hours == 0) {
					$("#time").css('color', 'red');
				}

				if (secs < 10)
					secs = '0' + secs;
				return hours + ':' + mins + ':' + secs;
			} else
				return;
		};

		$scope.close = function () {
			$modalInstance.close('close');
		};
	})
	.controller('downloadConfirmationController', function ($scope, $modalInstance, message, servicesAPI) {
		var video = message.video;
		var download = message.download;

		document.addEventListener('fileTransferEnd', function (e) {
			console.log(e);
			//			servicesAPI.deleteVideo(video.unique_name).then(function(resp) {
			//				console.log(resp);
			//			}, function(err) {
			//				console.log(err);
			//			});
		});

		$scope.downloadAndDestroy = function () {
			console.log('DOWNLOAD + DESTRUCTION STARTING');
			download(message.index, 'destroy');

		};

		$scope.downloadAndStore = function () {
			console.log('DOWNLOAD + STORAGE STARTING');
			download(message.index)
		};

		$scope.close = function () {
			$modalInstance.close('close');
		}
	})
	.controller('modalVideoRemovalController', function ($scope, $modalInstance, message, servicesAPI, prefLoader) {

		var vm = {};


		$scope.text = message.text;
		$scope.bought = false;
		$scope.videoName = vm.videoName = message.videoName || $scope.text.video_no_name;
		vm.uniqueName = message.videoUniqueName;

		servicesAPI.getVideoSoldHistory(vm.uniqueName).then(function (resp) {

			$scope.confirmVideoRemoval = function () {

				servicesAPI.deleteVideo(vm.uniqueName).then(
					function (success) {
						message.clearVideoIndex();
						message.swapVideoDivs(message.videoList);
						$scope.close();
					},
					function (error) {
						console.log(error);
					}
				);
			};
		}, function (err) {

			console.log(err);
			$scope.bought = true;
		});

		$scope.close = function () {
			$modalInstance.close('close');
		}
	})
	.controller('listVideosController', [
		'$scope', '$window', '$location', 'servicesAPI',
		'$http', '$filter', '$cookies', '$sce',
		'$timeout', '$q', '$interval', '$modal',
		'$route', 'prefLoader', '$mdMenu', '$mdDialog', '$mdSidenav', '$mdToast',
		function ($scope, $window, $location, servicesAPI, $http, $filter, $cookies, $sce, $timeout, $q, $interval, $modal, $route, prefLoader, $mdMenu, $mdDialog, $mdSidenav, $mdToast) {

			$scope.m4nAcces = false;
			$scope.controller = this;
			$scope.controller.state = null;
			$scope.controller.API = null;
			$scope.controller.currentVideo = 0;
			$scope.categories = [];
			$scope.categoryTranslations = [];
			$scope.tagListing = [];
			$scope.tagListingTranslations = [];
			$scope.videoLue = [];
			$scope.videos = [];
			$scope.searchVideos;
			$scope.thumbnails = {};
			$scope.currentVideo = {};
			$scope.currentVideoAuctionRemainingTime;
			$scope.listIndex = 0;
			$scope.listLookupIndex = 5;
			$scope.pathForIE = "";
			$scope.tags = [];
			$scope.categories = [];
			$scope.htmlVideoUsed = false;
			$scope.videogularUsed = true;
			$scope.sortCriteria = ""; //order of the list of videos by default
			$scope.token = {};
			$scope.dirty = {};
			$scope.lang;
			$scope.langIndex;
			$scope.numberRows = [1];
			$scope.videosTest = [{
					times_viewed: 12,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069833382,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 50.24,
						longitude: -73.109
					}],
					tags: [],
					sold_amount: null,
					unique_name: "af798815-7098-4367-8b93-4be709aa8df5",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "sdsds",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 10,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069821748,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 42.536,
						longitude: -71.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "vid",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 28,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069809060,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 45.536,
						longitude: -73.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "video test",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 12,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069833382,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 50.24,
						longitude: -73.109
					}],
					tags: [],
					sold_amount: null,
					unique_name: "af798815-7098-4367-8b93-4be709aa8df5",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "sdsds",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 10,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069821748,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 42.536,
						longitude: -71.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "vid",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 28,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069809060,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 45.536,
						longitude: -73.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "video test",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 12,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069833382,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 50.24,
						longitude: -73.109
					}],
					tags: [],
					sold_amount: null,
					unique_name: "af798815-7098-4367-8b93-4be709aa8df5",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "sdsds",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 10,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069821748,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 42.536,
						longitude: -71.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "vid",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 28,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069809060,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 45.536,
						longitude: -73.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "video test",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 12,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069833382,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 50.24,
						longitude: -73.109
					}],
					tags: [],
					sold_amount: null,
					unique_name: "af798815-7098-4367-8b93-4be709aa8df5",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "sdsds",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 10,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069821748,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 42.536,
						longitude: -71.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "vid",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 28,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069809060,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 45.536,
						longitude: -73.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "video test",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 12,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069833382,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 50.24,
						longitude: -73.109
					}],
					tags: [],
					sold_amount: null,
					unique_name: "af798815-7098-4367-8b93-4be709aa8df5",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "sdsds",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 10,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069821748,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 42.536,
						longitude: -71.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "vid",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 28,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069809060,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 45.536,
						longitude: -73.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "video test",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 12,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069833382,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 50.24,
						longitude: -73.109
					}],
					tags: [],
					sold_amount: null,
					unique_name: "af798815-7098-4367-8b93-4be709aa8df5",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "sdsds",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 10,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069821748,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 42.536,
						longitude: -71.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "c7f3ea29-7ac2-4b78-8e74-1db8fb84046e",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "vid",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				},
				{
					times_viewed: 28,
					streaming_endedon: 1492537062000,
					description: "",
					lastTimeVideoStatusChanged: 1493069809060,
					gps_coordinates: [{
						timezone: "UTC-5",
						latitude: 45.536,
						longitude: -73.108
					}],
					tags: [],
					sold_amount: null,
					unique_name: "6f0cf353-58be-4df4-8698-8627f5ce9bc2",
					person: {
						localization: {
							city: "St-Lambert",
							street: "269 Simard",
							appartment_no: "111111111111111",
							country_fips: "CA",
							state_abbreviation: "PQ "
						},
						language_code: "fr",
						firstname: "Pierre",
						phone: "9999999999",
						citizen_perormance_status: null,
						media_agent: {
							auction_limit: 5000000,
							total_temp_bid_value: null,
							media: [{
								name: "CNN2"
							}],
							bought_video_amount: 200
						},
						email: "jccaissie22@gmail.com",
						username: "jcc",
						lastname: "Bruneau"
					},
					name: "video test",
					category: [{
							translation: "Terrorism",
							name: "TERRORIMS",
							id: 6,
							lang: "en"
						},
						{
							translation: "Terrorisme",
							name: "TERRORIMS",
							id: 6,
							lang: "fr"
						}
					],
					streaming_startedon: 1492537062000,
					status: "AUCTION",
					mediaWeight: null
				}
			];




			var geocoder = new google.maps.Geocoder();
			var videoSearchResult = {};
			var thumbnailsRecuperes = {};
			var videoPlanCoordinates = [];
			var path = "";
			var tagsBeforeModification = [];
			var indexVideoToRemove;
			var currentSortingCriteria = "creationDate"; // variable that memorize the sorting criteria (useful when there is a video removal in the sorted list of videos to refresh the list with the same sorting)
			var bugFixedForZeroTag = true;
			var currentReverse = false; //variable that memorize if the sorting criteria has to be reversed or not
			var indexCurrent; //var that stockes the indes of the current displayed video
			var flag = 0; //for test of the refresh of the video source in the watching frame: OK
			var reload = false;
			var doInitList = true;
			var userAgent = $window.navigator.userAgent;
			var browser = browserDetection(userAgent);
			var timeInterval;

			$scope.$watch('videos', (newval, old, scope) => {
				console.log("Length: " + newval.length);
				if (newval != null && newval.length > 0)
					$scope.numberRows = new Array(Math.ceil($scope.videos.length / 2));



			});



			/*We check the cookies to access this page*/
			var cookie = $cookies.get("e-session");
			var cookieSuccessModification = $cookies.get("modifOk");

			if (!cookie) {
				window.location.href = "../#login";
			}

			videosListInitialization(true);
			var stop;
			stop = $interval(function () {
				servicesAPI.infoVideo()
					.then(function (data) {
						var i = 0;
						var find = false; //We browse the data array to find the unique_name matching current video's to update information of the current video
						while (i < data.length && !find) {
							if (data[i] != undefined) {
								if (data[i].unique_name == $scope.currentVideo.unique_name) {
									$scope.currentVideo = data[i];
									find = true;
								}
							}
							i++;
						}
					}, function (e) {
						console.log(e);
					});
			}, 3000);

			$scope.activateTimer = function (time) {
				$interval(function () {
					time = time + 1;
				}, 1000);
			};

			$scope.editUser = function () {
				$mdDialog.show({
					contentElement: '#editUser',
					parent: angular.element(document.body)
				});
			}

			// Function to change user information.
			// $scope.validate = function (user) {
			// 	//reinitialization of error message concerning required fields
			// 	$scope.nameAlreadyUsed = false;
			// 	$scope.mailAlreadyUsed = false;
			// 	$scope.countryNotChosen = false;
			// 	$scope.stateNotChosen = false;
			// 	$scope.languageNotChosen = false;
			// 	$scope.nameLenghtNotValid = false;
			// 	$scope.modificationPb = false;
			// 	$scope.addressLengthNotValid = false;
			// 	$scope.telFormatInvalid = false;
			// 	$scope.telExamples = "";
			// 	// We verify if the username contain between 8 and 20 characters            
			// 	if (user.name.length != 0 && (user.name.length < 8 || user.name.length > 20)) {
			// 		$scope.nameLenghtNotValid = true;
			// 		return;
			// 	}
			// 	//We check if the telephone format is valid
			// 	//N.B: for  french cell phones, numbers start with 06 or 07 (+336 or +337 with the international indicator)
			// 	//As the attribute in the Person Table is called "cell_phone_number" in the DB, only cell phones are accepted
			// 	//for a french user
			// 	var pattern = $scope.paysList[user.country].phonePattern;
			// 	var phoneEntered = user.telephone;

			// 	var tel = phoneEntered.split(" ").join('')

			// 	var re = new RegExp($scope.paysList[user.country].phonePattern)
			// 	if (tel.match(re) == null) {
			// 		$scope.telExamples = $scope.paysList[user.country].phoneExamples;
			// 		$scope.telFormatInvalid = true;
			// 		return;
			// 	}

			// 	//We check if the address length is valid
			// 	if (user.address.length > 100) {
			// 		$scope.addressLengthNotValid = true;
			// 		return;
			// 	}

			// 	//We verifiy if the country is selected
			// 	if (user.country == undefined) {
			// 		$scope.countryNotChosen = true;
			// 		return;
			// 	}
			// 	//Verify if the state is selected
			// 	if (user.state == undefined) {
			// 		$scope.stateNotChosen = true;
			// 		return;
			// 	}
			// 	//Verify if the language is selected
			// 	if (user.language == undefined) {
			// 		$scope.languageNotChosen = true;
			// 		return;
			// 	}

			// 	// Case of a subscription without username
			// 	if (user.name == undefined || user.name.length == 0) {
			// 		servicesAPI.editAccount( //For the moment, we have to put the email for the username in that case
			// 				user.email,
			// 				user.email,
			// 				user.firstname,
			// 				user.lastname,
			// 				tel,
			// 				user.address,
			// 				user.city,
			// 				user.country,
			// 				user.state,
			// 				user.language)
			// 			.success(function () {
			// 				/*console.log("aprobado");*/
			// 				$cookies.put("modifOk", "1");
			// 				$('#grand-modal').modal('close');
			// 				//$location.path("/");

			// 			})
			// 			.error(function () {
			// 				console.log("error");
			// 				$scope.modificationPb = true;
			// 			})


			// 	} else {

			// 		servicesAPI.editAccount(
			// 				user.name,
			// 				user.email,
			// 				user.firstname,
			// 				user.lastname,
			// 				tel,
			// 				user.address,
			// 				user.city,
			// 				user.country,
			// 				user.state,
			// 				user.language)
			// 			.success(function () {
			// 				$cookies.put("modifOk", "1");
			// 				$('#grand-modal').modal('close');
			// 				//$location.path("/");

			// 			})
			// 			.error(function () {
			// 				$scope.modificationPb = true;
			// 			})


			// 	}

			// };

			// Get list of languages and countries to modify account
			function getLanguages() {
				servicesAPI.recupLangues().then(function (data) {
					$scope.langueList = data.data;
				}, function () {
					alert("Erreur chargement des langues");
				});
				servicesAPI.recupLocalization().then(function (data) {
					$scope.paysList = data.data;
				}, function () {
					alert("Erreur chargement des pays");
				});
				servicesAPI.verifAuthentifie().then(function (data) {
					// console.log("user", data);
					//We suppress the space at the end of the returned state_abbreviation
					data = data.data.user;
					var etat = data.localization.state_abbreviation.split(" ")[0];
					//We fill the fields with the retrieved informations (city is hardcoded for the moment)
					$scope.user = {
						name: data.username,
						firstname: data.firstname,
						lastname: data.lastname,
						email: data.email,
						telephone: data.phone,
						address: data.localization.street,
						city: data.localization.city,
						country: data.localization.country_fips,
						state: etat,
						language: data.language_code
					};
					if (data.media_agent !== undefined)
						$scope.m4nAccess = true;
					$scope.listStates = getStatesByCurrentCountry();
				});


			}

			// Function to change user information.
			$scope.validate = function (user) {
				//reinitialization of error message concerning required fields
				$scope.nameAlreadyUsed = false;
				$scope.mailAlreadyUsed = false;
				$scope.countryNotChosen = false;
				$scope.stateNotChosen = false;
				$scope.languageNotChosen = false;
				$scope.nameLenghtNotValid = false;
				$scope.modificationPb = false;
				$scope.addressLengthNotValid = false;
				$scope.telFormatInvalid = false;
				$scope.telExamples = "";
				// We verify if the username contain between 8 and 20 characters            
				if (user.name.length != 0 && (user.name.length < 8 || user.name.length > 20)) {
					$scope.nameLenghtNotValid = true;
					return;
				}
				//We check if the telephone format is valid
				//N.B: for  french cell phones, numbers start with 06 or 07 (+336 or +337 with the international indicator)
				//As the attribute in the Person Table is called "cell_phone_number" in the DB, only cell phones are accepted
				//for a french user
				var pattern = $scope.paysList[user.country].phonePattern;
				var phoneEntered = user.telephone;

				var tel = phoneEntered.split(" ").join('')

				var re = new RegExp($scope.paysList[user.country].phonePattern)
				if (tel.match(re) == null) {
					$scope.telExamples = $scope.paysList[user.country].phoneExamples;
					$scope.telFormatInvalid = true;
					return;
				}

				//We check if the address length is valid
				if (user.address.length > 100) {
					$scope.addressLengthNotValid = true;
					return;
				}

				//We verifiy if the country is selected
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

				// Case of a subscription without username
				if (user.name == undefined || user.name.length == 0) {
					servicesAPI.editAccount( //For the moment, we have to put the email for the username in that case
							user.email,
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
							/*console.log("aprobado");*/
							$cookies.put("modifOk", "1");
							$('#formEditUser').hide();
							$('#correctEdit').show(500);
							/*$interval(function () {								
								$scope.closeDialog();
								$('#correctEdit').hide();
								$('#formEditUser').show();
							}, 2000, 1);*/
							// correctEdit
							// formEditUser

							//$location.path("/");

						}, function () {
							console.log("error");
							$scope.modificationPb = true;
						})


				} else {

					servicesAPI.editAccount(
							user.name,
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
							$cookies.put("modifOk", "1");
							// $scope.closeDialog();
							$('#formEditUser').hide();
							$('#footerModal').hide();
							$('#correctEdit').show(500);
							$interval(function () {
								$scope.closeDialog();
								$interval(function () {
									$('#correctEdit').hide();
									$('#formEditUser').show();
									$('#footerModal').show();
								}, 500, 1);
							}, 2000, 1);
							//$location.path("/");

						}, function () {
							$scope.modificationPb = true;
						})


				}

			};

			function getStatesByCurrentCountry() {
				servicesAPI.getStates($scope.user.country)
					.then(function (data) {
						data = data.data;
						$scope.listStates = data.states;
					}, function (err) {
						console.log(err);
					});
			}

			$scope.$watch('tags.length', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.validateTags();
				}
			});

			prefLoader.getLanguage().then(
				function (resp) {
					$scope.userLanguageVocabulary = resp.data.video_list_vocabulary;
					$scope.userLanguageMenuOptions = resp.data.header_menu_options;
					$scope.userLanguageAccountFields = resp.data.edit_account_fields;
					$scope.displayCategory = $scope.userLanguageVocabulary.categories_text;
					$scope.lang = $scope.userLanguageMenuOptions.header_option_current_lang;
					$scope.langIndex = selectLangTranslationIndex($scope.lang);
					$scope.removalText = resp.data.videoRemovalModal;
					servicesAPI.getCategoryListing().then(function (resp) {
						$scope.categoryTranslations = resp.data.sort(valueSort('translation'));
						$scope.categories = getTranslationsForLang($scope.lang, resp.data);
					}, function (err) {
						console.log(err);
					});
					servicesAPI.getTagListing().then(function (resp) {
						$scope.tagListing = getTranslationsForLang($scope.lang.toLowerCase(), resp.data.sort(valueSort('translation')));
						$scope.tagListingTranslations = resp.data.sort(valueSort('translation'));
					}, function (err) {
						console.log(err);
					});
				},
				function (err) {
					console.log(err);
				}
			)

			if (browser == "ie" || browser == "edge" || browser == "safari") {
				$scope.htmlVideoUsed = true;
				$scope.videogularUsed = false;
			}

			/*Fix JS for edge...*/
			if (browser == "edge") {
				var $ul = $("#scrolldiv").find("ul");
				$ul.css("position", "relative");
				$ul.css("top", "1.2em");
				setTimeout(function () {
					$("#scrolldiv").find(".media.mymedia").each(function () {
						$(this).css("margin-bottom", "4em");
					});
				}, 300);
			}
			/*End fix*/

			/*When we leave the page, we stop the loop-calling of the interval-function*/
			$scope.$on('$destroy', function () {
				// Make sure that the interval is destroyed too
				$interval.cancel(stop);
				stop = undefined;
			});

			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

			$scope.changePage = function (link) {
				console.log(link);
				window.location.href = link;
			}

			$scope.changePageMarker = function () {
				var link = "#/videoViewerAuctions";
				window.location.href = link;
			}

			$scope.myVideosTab = true;

			function getChangesVideo(localArray, newArray) {
				newArray.forEach((grandItem, grandIndex) => {
					var flag = false;
					localArray.forEach((item, index) => {
						if (grandItem.unique_name === item.unique_name) {
							flag = true;
							for (var elementValue in grandItem) {
								/*var element = object[elementValue];*/
								item[elementValue] = grandItem[elementValue];
							}
							return;
						}
						/*
												if (((index + 1) === localArray.length) && !flag) {
													localArray.push(grandItem);
												}*/
					});
				});
			}


			function confirmAuctionning(index, addingToAuction) {
				/*console.log($scope.videos[index]);*/
				servicesAPI.toAuction($scope.videos[index].unique_name, addingToAuction).then(
					function (response) {
						$scope.videos[index].status = addingToAuction ? 'AUCTION' : 'READY';
					},
					function (error) {
						console.log(error);
					});
			};

			$scope.videoSelected;

			$scope.showPrerenderedDialog = function (ev, video) {
				$mdDialog.show({
					contentElement: '#myDialog',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true
				});
				$scope.videoSelected = video;
				if (video.auction) {
					servicesAPI.getVideoAuctionBidHistory(video.unique_name).then(function (resp) {
						// console.log(resp);
						$scope.history = resp.data;
						for (var bid in $scope.history) {
							$scope.history[bid].bidDateTime = new Date($scope.history[bid].bidDateTime);
						}
						$scope.vidName = $scope.history[bid].video[0].name;
						setTimeout(function () {
							$("#bid-table").DataTable();
						}, 200);
					}, function (err) {
						console.log(err);
					});

				}

				/*$scope.bidTimeout = function () {
					if (video.auction !== undefined) {
						var timeleft = video.auction.end - new Date();
						if (timeleft < 0) {
							return '0:00:00';
						}

						var hours = Math.floor(timeleft / (60 * 60 * 1000));
						var mins = Math.floor(timeleft / (60 * 1000) % 60);
						var secs = Math.floor((timeleft / 1000) % 60);
						if (mins < 10)
							mins = '0' + mins;
						if (mins < 5 && hours == 0) {
							$("#time").css('color', 'red');
						}

						if (secs < 10)
							secs = '0' + secs;
						return hours + ':' + mins + ':' + secs;
					}
				};*/

			};

			$scope.bidTimeout = function (video) {
				if (video != null && video.auction != undefined) {
					var timeleft = video.auction.end - new Date();
					if (timeleft < 0) {
						return '0:00:00';
					}

					var hours = Math.floor(timeleft / (60 * 60 * 1000));
					var mins = Math.floor(timeleft / (60 * 1000) % 60);
					var secs = Math.floor((timeleft / 1000) % 60);
					if (mins < 10)
						mins = '0' + mins;
					if (mins < 5 && hours == 0) {
						$("#time").css('color', 'red');
					}

					if (secs < 10)
						secs = '0' + secs;
					return hours + ':' + mins + ':' + secs;
				}
			};

			$scope.putAuction = function (ev, index, addingToAuction) {
				var text = "confirmez-vous que vous voulez mettre cette video a l'enchère?";
				if (addingToAuction == false)
					text = "confirmez - vous vous enlever cette video de l'enchère?"

				var confirm = $mdDialog.confirm()
					.title('Auction Video')
					.textContent(text)
					.ariaLabel('Lucky day')
					.targetEvent(ev)
					.ok('Accept')
					.cancel('Cancel');
				$mdDialog.show(confirm).then(function () {
					confirmAuctionning(index, addingToAuction);
					/*$scope.videos[index].status = addingToAuction ? 'AUCTION' : 'READY';*/
				}, function () {});
			};

			function removeVideo(index) {
				servicesAPI.deleteVideo($scope.videos[index].uniqueName).then(
					function (success) {
						$scope.videos.splice(index, 1);
					},
					function (error) {
						console.log(error);
					}
				);
			};

			$scope.deleteVideo = function (ev, index) {
				var confirm = $mdDialog.confirm()
					.title('Delete video')
					.textContent("voulez-vous effacer cette video??")
					.ariaLabel('Lucky day')
					.targetEvent(ev)
					.ok('Accept')
					.cancel('Cancel');
				$mdDialog.show(confirm).then(function () {
					removeVideo(index);
				}, function () {
					/*$scope.status = 'You decided to keep your debt.';*/
				});
			};


			$scope.addTag = function (tmp, menu, video) {
				if (tmp.tags.length >= 10) {
					$mdToast.show($mdToast.simple().textContent('Too many shits!'));

				} else if (tmp.tags.indexOf(tmp.newTag) !== -1) {
					$mdToast.show($mdToast.simple().textContent('The tag is already in it'));
				} else {
					tmp.tags.push(tmp.newTag);
					tmp.newTag = '';
					menu.close();
					console.log(video.tags);
				}
			};

			$scope.editname = function () {
				var editname = document.getElementById('editedname').value;
				var descr = $scope.currentVideo.description || "";
				var category = $scope.currentVideo.category || "";
				var ind = findIndexByUniqueName($scope.currentVideo.unique_name) || 0;

				servicesAPI.editVideo($scope.currentVideo.unique_name, descr, editname, category).then(function () {
					alert("La modification a bien été prise en compte");
					$("#editedname").val(editname);
					$scope.currentVideo.name = editname;
					updateVideoScope(ind, $scope.currentVideo);
				}, function () {
					alert("La modification n'a pas été prise en compte");
				});
			}

			$scope.openSideMenu = function (navId) {
				$mdSidenav(navId)
					.toggle();
			}

			$scope.controller.onPlayerReady = function (API) {
				$scope.controller.API = API;
			};

			$scope.controller.onCompleteVideo = function () {
				$scope.controller.isCompleted = true; //We reload the video with the current path of video to be able to replay the video after watiching it
				$scope.videoLue = [{
					sources: [{
						src: $sce.trustAsResourceUrl(path),
						type: "video/mp4" || $sce.trustAsResourceUrl(path),
						type: "video/ogv" || $sce.trustAsResourceUrl(path),
						type: "video/webm"
					}]
				}];
				$scope.controller.config.sources = $scope.videoLue[0].sources;
			};

			$scope.sortByCriteria = function (critere, reverse) {
				$scope.currentSortingCriteria = critere;
				currentReverse = reverse;

				if (critere == 'title' && !reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_alpha;
				}
				if (critere == 'creationDate' && reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_creation_date;
				}
				if (critere == 'creationDate' && !reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_creation_date_inv;
				}
				if (critere == 'endAuctionDate' && reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_end_auction_date;
				}
				if (critere == 'endAuctionDate' && !reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_end_auction_date_inv;
				}
				if (critere == 'amount' && reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_auction_amount_asc;
				}
				if (critere == 'amount' && !reverse) {
					$scope.sortCriteria = $scope.userLanguageVocabulary.order_auction_amount_desc;
				}

				$scope.videos = $filter('sortBy')($scope.videos, critere, reverse);
				// $scope.numberRows = new Array(Math.ceil($scope.videos / 2));
			}

			$scope.loadTags = function (query) {
				return $http.get('vendors/tags.json');
			};

			$scope.reduceTag = function (temp, i) {

			}

			/*Function that convert timestamp to a real date*/
			$scope.convertTimestampToDate = function (timestamp) {
				var date = new Date(timestamp);
				var strDate = "";

				strDate = date.getFullYear() + '/';

				if (date.getMonth() < 9) {
					strDate += "0" + (date.getMonth() + 1) + '/';
				} else {
					strDate += (date.getMonth() + 1) + '/';
				}

				if (date.getDate() < 10) {
					strDate += "0" + date.getDate() + ' ';
				} else {
					strDate += date.getDate() + ' ';
				}

				if (date.getHours() < 10) {
					strDate += "0" + (date.getHours());
				} else {
					strDate += (date.getHours());
				}
				if (date.getMinutes() < 10) {
					strDate += ":0" + (date.getMinutes());
				} else {
					strDate += ":" + (date.getMinutes());
				}

				return strDate;
			}

			/*Function that displays the informations of the selected video*/
			$scope.displayVideo = function (index) {
				$interval.cancel(timeInterval);
				$("html, body").animate({
					scrollTop: 0
				}, 400);
				indexCurrent = index;
				$scope.currentVideo = $scope.videos[index];

				if ($scope.currentVideo.category !== null)
					$scope.displayCategory = prefLoader.getCookie("language") === "en" ? $scope.currentVideo.category[0].translation : $scope.currentVideo.category[1].translation;
				else
					$scope.displayCategory = $scope.userLanguageVocabulary.categories_text;

				setVideoOptionFromStatus($scope.currentVideo.status);
				$("#editedname").val($scope.currentVideo.name);
				$scope.controller.API.stop();
				$timeout($scope.controller.API.play.bind($scope.controller.API), 100);
				initMap(getVideoCoordinate());
				reloadVideo($scope.currentVideo.unique_name);

				servicesAPI.getListOfTags($scope.currentVideo.unique_name).then(function (data) {
					tagsBeforeModification = [];
					for (var i = 0; i < data.length; ++i) {
						tagsBeforeModification.push(data[i].translation[$scope.langIndex]);
					}

					$scope.tags = tagsBeforeModification;
				});

				timeInterval = $interval(initAuctionTimer, 1000);
			}

			/*Function that calculates the lasting of a video*/
			$scope.calcLasting = function (end, start) {
				var d = new Date(start);
				var p = new Date(end);
				var res = p.getTime() - d.getTime();
				var h = Math.floor(res / 3600000);
				var m = Math.floor((res - h * 3600000) / 60000);
				var s = Math.floor((res - h * 3600000 - m * 60000) / 1000);
				var duree = h + " h " + m + " min " + s + " sec";
				return duree;
			}

			/*Function that writes in French the status of the video*/
			$scope.frenchStatus = function (status) {

				var vidStatus;
				$scope.viewVideo = true;
				$scope.viewVideo1 = false;
				$scope.viewVideo2 = false;

				if (status != undefined && $scope.userLanguageVocabulary != undefined) {

					if (status == "READY") {
						vidStatus = $scope.userLanguageVocabulary.video_status.ready;
					} else if (status == "AUCTION") {
						vidStatus = $scope.userLanguageVocabulary.video_status.auction;
					} else if (status == "COMPILATION") {
						vidStatus = $scope.userLanguageVocabulary.video_status.compilation;
						$scope.viewVideo = false;
						$scope.viewVideo1 = true;
					} else if (status == "DOWNLOAD") {
						vidStatus = $scope.userLanguageVocabulary.video_status.downloaded;
					} else if (status == "STREAMING") {
						vidStatus = $scope.userLanguageVocabulary.video_status.recording;
						$scope.viewVideo = false;
						$scope.viewVideo1 = true;
					}

					return vidStatus;
				} else
					return;
			};

			/*Function that validates the submitted list of tags for the current video*/
			$scope.validateTags = function () {
				//We reset to false the boolean used to display or not the alert for duplications or for a number of tags strictly higher than 5
				$scope.duplications = false;
				$scope.tooManyTags = false;
				$scope.modifSuccess = false;
				$scope.modifError = false;
				$scope.noModif = false;
				var modifSuccessLocal = false;
				var modifErrorLocal = false;

				if ($scope.tags.length > 10) {
					$scope.tooManyTags = true;
				} else {
					var tag = $($scope.tags).not(tagsBeforeModification).get();
					var tmp;

					if (tag.length === 0) {
						tmp = tagsBeforeModification;
						tag = tmp;
						tagsBeforeModification = [];
					}

					if (tag.length === 1 && tagsBeforeModification.length !== $scope.tags.length && !bugFixedForZeroTag) {
						servicesAPI.addATag($scope.currentVideo.unique_name, tag[0].name).then(function () {
							$scope.modifSuccess = true;
							$scope.modifError = false;
						}, function (e) {
							$scope.modifSuccess = false;
							$scope.modifError = true;
							console.log(e);
						});
					}

					bugFixedForZeroTag = false;
					tagsBeforeModification = tmp;

					tag = $(tagsBeforeModification).not($scope.tags).get();
					if (tag.length === 1 && tagsBeforeModification.length != $scope.tags.length) {
						servicesAPI.deleteATag($scope.currentVideo.unique_name, tag[0].name).then(function () {
							$scope.modifSuccess = true;
							$scope.modifError = false;
						}, function () {
							$scope.modifSuccess = false;
							$scope.modifError = true;
						});
					}
				};


				//reset to new tagList after modification
				tagsBeforeModification = [];
				for (var i = 0; i < $scope.tags.length; i++)
					tagsBeforeModification[i] = $scope.tags[i];

				//3 seconds after the validation, we hide all the alerts
				$timeout(function () {
					$scope.duplications = false;
					$scope.tooManyTags = false;
					$scope.modifSuccess = false;
					$scope.modifError = false;
					$scope.noModif = false;
				}, 3000);
			};





			$scope.deleteCategory = function (videoTmp, id) {
				var categories = videoTmp.category;
				var temp = [];
				categories.forEach((item, index) => {
					if (item.id != id) {
						temp.push(item);
					}
					if ((index + 1) == categories.length) {
						videoTmp.category = temp;
					}
				});

			};

			$scope.prepEdit = function (tmp, video) {
				tmp.name = video.name;
				tmp.category = [];
				tmp.tags = [];
				video.category.forEach((item) => {
					tmp.category.push(item);
				});
				video.tags.forEach((item) => {
					tmp.tags.push(item);
				});
			}

			$scope.addTag = function (video, tag) {
				servicesAPI.addATag(video.unique_name, tag.name)
					.then(function (result) {
						console.log("tag agregado");
					}, function (err) {
						console.log("tag error");
					});
			}

			$scope.deleteTagUpdated = function (video, tag) {
				servicesAPI.deleteATag(video.unique_name, tag.name)
					.then(function (result) {
						console.log("tag eliminado");
					}, function (err) {
						console.log("tag error");
					});
			}

			$scope.acceptChangesVideo = function (video, tmp) {
				video.name = tmp.name;
				video.category = tmp.category;
				video.tags = tmp.tags;
				servicesAPI.editVideo(video.unique_name, video.description, video.name, tmp.categorySelected).then(
					function (resp) {
						tmp.categorySelected = null;
					},
					function (err) {
						tmp.categorySelected = null;
						console.log(err);
					}
				);
			};

			$scope.open = function open(index) {
				index = (index === undefined && $scope.currentVideo !== undefined) ? findIndexByUniqueName($scope.currentVideo.unique_name) : index;
				var modalInstance = $modal.open({
					templateUrl: 'resources/views/video/deleteModal.html',
					backdrop: 'static',
					dialogFade: false,
					keyboard: false,
					controller: 'modalVideoRemovalController as modalVideoRemovalCtrl',
					resolve: {
						message: function () {
							return {
								videoName: $scope.videos[index].name,
								videoUniqueName: $scope.videos[index].unique_name,
								videoList: $scope.videos,
								text: $scope.userLanguageVocabulary,
								clearVideoIndex: function () {
									$scope.videos.splice(index, 1);
									var nextVideo = $scope.videos[index];
									if (nextVideo)
										$scope.displayVideo(index + 1);
									else
										swapVideoDivs();
								},
								swapVideoDivs: function (data) {
									swapVideoDivs(data);
								}
							}
						}
					}
				});
			}

			$scope.openMenu = function ($mdMenu, ev) {
				originatorEv = ev;
				$mdMenu.open(ev);
			};


			/*var vid = message.video;
			$scope.hasAuction = vid.auction === undefined ? false : true;
			$scope.history = undefined;

			if ($scope.hasAuction) {

				servicesAPI.getVideoAuctionBidHistory(vid.unique_name).then(function (resp) {
					$scope.history = resp.data;
					for (var bid in $scope.history) {
						$scope.history[bid].bidDateTime = new Date($scope.history[bid].bidDateTime);
					}

					$scope.vidName = $scope.history[bid].video[0].name;
					setTimeout(function () {
						$("#bid-table").DataTable();
					}, 200);
				}, function (err) {
					console.log(err);
				});

			}

			$scope.bidTimeout = function () {

				if (vid.auction !== undefined) {
					var timeleft = vid.auction.end - new Date();
					if (timeleft < 0) {
						return '0:00:00';
					}

					var hours = Math.floor(timeleft / (60 * 60 * 1000));
					var mins = Math.floor(timeleft / (60 * 1000) % 60);
					var secs = Math.floor((timeleft / 1000) % 60);
					if (mins < 10)
						mins = '0' + mins;
					if (mins < 5 && hours == 0) {
						$("#time").css('color', 'red');
					}

					if (secs < 10)
						secs = '0' + secs;
					return hours + ':' + mins + ':' + secs;
				}
			};

			$scope.close = function () {
				$modalInstance.close('close');
			};*/

			$scope.downloadVid = function downloadVid(index) {
				var modalInstance = $modal.open({
					templateUrl: 'resources/views/video/downloadConfirmationModal.html',
					backdrop: 'static',
					dialogFade: true,
					keyboard: false,
					controller: 'downloadConfirmationController',
					resolve: {
						message: function () {
							return {
								video: $scope.videos[index],
								download: download,
								index: index
							}
						}
					}
				});
			};

			var download = function download(index, option) {
				var video = $scope.videos[index] || $scope.currentVideo;
				var stringQuery;
				var stringQuery = option === undefined ? '' : "?option=";

				if (video.status === "READY" || video.status === "DOWNLOAD") {

					servicesAPI.recupTokenVideo(video.unique_name).then(
						function (res) {
							if (video.status === "DOWNLOAD") {
								location.href = '../api/videos/' + video.unique_name + '/play/' + res.data.viewing_token + '/mp4' + stringQuery + (option || '');
							} else {
								//update video status
								servicesAPI.setVideoStatus(video.unique_name, "DOWNLOAD").then(
									function (response) {
										$scope.videos[findIndexByUniqueName(video.unique_name)].status = "DOWNLOAD";
										location.href = '../api/videos/' + video.unique_name + '/play/' + res.data.viewing_token + '/mp4' + stringQuery + (option || '');
									},
									function (err) {
										console.log(err);
									}
								);
								setVideoOptionFromStatus("DOWNLOAD");
							}
						},
						function (err) {
							console.log(err);
						}
					);
				} else {
					console.log("nia nia nia! This video is in auction you tricky person!");
				}
			}

			$scope.putToAuction = function putToAuction(listIndex, addingToAuction) {

				var index = (listIndex === undefined && $scope.currentVideo != undefined) ? findIndexByUniqueName($scope.currentVideo.unique_name) : listIndex;
				var templateUrl = 'resources/views/video/auctionConfirmationModal.html';
				if (!addingToAuction)
					templateUrl = 'resources/views/video/auctionRemovalModal.html';

				var modalInstance = $modal.open({
					templateUrl: templateUrl,
					backdrop: 'static',
					dialogFade: true,
					controller: 'auctionConfirmationModalController',
					resolve: {
						message: function () {
							return {
								video: $scope.videos[index],
								addingToAuction: addingToAuction,
								updateVideoStatus: function (status) {
									$scope.videos[index].status = status;
								}
							}
						}
					}
				});
			}


			$scope.seeAuctionsOnItem = function seeAuctionsOnItem(listIndex) {

				var modalInstance = $modal.open({
					templateUrl: "resources/views/video/auctionView.html",
					backdrop: 'static',
					dialogFade: true,
					controller: 'auctionViewingController',
					resolve: {
						message: function () {
							return {
								video: $scope.videos[listIndex],
								text: $scope.auctionRemovalModal,
								convertTimestamp: $scope.convertTimestampToDate
							}
						}
					}
				});
			}

			$scope.videoIsInState = function (index, state) {
				if (index === undefined && $scope.currentVideo != undefined)
					return $scope.currentVideo.status === state;
				else if (index !== undefined && $scope.videos[index] !== undefined)
					return $scope.videos[index].status === state;
				else
					return;
			}

			$scope.videoHasCategory = function (index) {
				if (index === undefined && $scope.currentVideo != undefined)
					return $scope.currentVideo.category !== null;
				else if (index !== undefined && $scope.videos[index] !== undefined)
					return $scope.videos[index].category !== null;
				else
					return;
			}

			$scope.videoHasBeenViewed = function (index) {
				return $scope.videos[index].times_viewed > 0;
			}

			$scope.alreadyHasBids = function alreadyHasBids(index) {
				if (index === undefined && $scope.currentVideo !== undefined) {
					return $scope.currentVideo.auction !== undefined;
				} else if (index !== undefined && $scope.videos[index] !== undefined) {
					return $scope.videos[index].auction !== undefined;
				} else
					return;
			}

			angular.element(document).ready(function () {
				// document.getElementById('msg').innerHTML = 'Hello';
				/*servicesAPI.verifAuthentifie().then(function (data) {
					data = data.data;
					//We suppress the space at the end of the returned state_abbreviation
					data = data.user;
					var etat = data.localization.state_abbreviation.split(" ")[0];
					//We fill the fields with the retrieved informations (city is hardcoded for the moment)
					$scope.user = {
						name: data.username,
						firstname: data.firstname,
						lastname: data.lastname,
						email: data.email,
						telephone: data.phone,
						address: data.localization.street,
						city: data.localization.city,
						country: data.localization.country_fips,
						state: etat,
						language: data.language_code
					};


					$scope.m4nAccess = data.media_agent === undefined ? false : true;
				});*/
				getLanguages();
			});



			/*$scope.getVideoCategory = function (index) {
				var lang = prefLoader.getCookie("language");
				if (index !== undefined && $scope.videos[index] !== undefined && $scope.videos[index].category !== null)
					return (lang == "en") ? $scope.videos[index].category[0].translation : $scope.videos[index].category[1].translation;
				else
					return;
			}*/

			$scope.showNav = function showNav(next) {
				if (!next) {
					return $scope.listIndex > 0;
				} else {
					return $scope.videos.length > $scope.listLookupIndex;
				}
			}

			$scope.navigateVideoList = function (next) {
				var pos = "+=888";
				if (next) {
					pos = "-=888";

					++$scope.listIndex;
				} else {
					--$scope.listIndex;
				}

				const VIDEO_ELEMENT_COUNT = 5;
				$scope.listLookupIndex = ($scope.listIndex * VIDEO_ELEMENT_COUNT) + VIDEO_ELEMENT_COUNT;

				$("#scrolldiv").animate({
					opacity: 0.25
				}, 50, function () {
					$(this).animate({
						top: pos
					}, 750, function () {
						$(this).animate({
							opacity: 1
						});
					});
				});
			}

			$scope.selectLanguage = function (lang) {
				prefLoader.changeLanguage(lang).then(
					function (resp) {
						$scope.userLanguageMenuOptions = resp.data.header_menu_options;
						$scope.userLanguageVocabulary = resp.data.video_list_vocabulary;
						$scope.lang = lang;
						$scope.langIndex = selectLangTranslationIndex($scope.lang);
						$scope.categories = getTranslationsForLang(lang, $scope.categoryTranslations);
						$scope.tagListing = getTranslationsForLang(lang, $scope.tagListingTranslations);
						tagsBeforeModification = translateTags(lang, tagsBeforeModification);
						$scope.tags = translateTags(lang, $scope.tags);
						if ($scope.currentVideo.category != null)
							$scope.displayCategory = lang === "en" ? $scope.currentVideo.category[0].translation : $scope.currentVideo.category[1].translation;
					},
					function (err) {
						console.log(err);
					}
				);
			};

			$scope.geocode = function (lat, lng, video) {
				geocoder.geocode({
						'location': {
							lat: Number(lat),
							lng: Number(lng)
						}
					},
					function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							video.location = results[results.length - 2].formatted_address;
							return;
						} else {
							console.log(status);
							return;
						}
					});
			};


			$scope.getTimer = function (video) {
				if (video.auction != null) {
					video.counter = video.counter == null ? (14400 - (Math.floor((video.auction.end - new Date()) / 1000))) : video.counter;
					$interval(function () {
						video.counter = video.counter + 1;
					}, 1000);
				} else {
					return;
				}

			}

			/*servicesAPI.verifAuthentifie()
				.then(function (data) {
					data = data.data;
					$scope.user = data;
					if (data.user.media_agent !== undefined)
						$scope.m4nAccess = true;
					console.log(data);
				}, function () {
					$cookies.remove("e-session", {
						path: "/"
					});
					window.location.href = "./../#login";
				});*/

			$scope.categoryChange = function (videoCategory) {
				var videoName = $scope.currentVideo.name || "";
				var videoUniqueName = $scope.currentVideo.unique_name;
				var videoDescr = $scope.currentVideo.description || "";

				servicesAPI.editVideo(videoUniqueName, videoDescr, videoName, videoCategory).then(
					function (resp) {
						$scope.displayCategory = videoCategory;
						setTimeout(function () {
							servicesAPI.getVideoCategory(videoUniqueName).then(function (resp) {
								$scope.videos[findIndexByUniqueName(videoUniqueName)].category = resp.data;
							}, function (err) {
								console.log(err);
							});
						}, 50);
					},
					function (err) {
						console.log(err);
					}
				);
			};


			/*Function that initialize the list of the current user's videos (called after each page load and each video suppression modal)*/
			function videosListInitialization(showVideosList) {
				$interval(function () {
					servicesAPI.infoVideo()
						.then(function (data) {
							data = data.data;
							/*console.log(data);*/
							if (data !== undefined) {
								data = $filter('sortBy')(data, currentSortingCriteria, true);
								if (data.length !== 0) {
									if (data[0].person.media_agent !== undefined)
										$scope.m4nAccess = true;
								}
							}
							if (showVideosList) {
								console.log("videos", $scope.videos);
								if ($scope.videos == undefined || $scope.videos.length == 0)
									$scope.videos = $scope.searchVideos = data;
								else {
									getChangesVideo($scope.videos, data);

								}

								// $scope.numberRows = new Array(Math.ceil($scope.videos / 2));
							}
							initList();
						})
				}, 5000);
			}

			/*Function that set the correct format to display tags in the tag bar*/
			function setFormatTag(tag) {
				var res = {
					name: tag.name,
					translation: tag.translation,
					lang: tag.lang
				};

				return res;
			}

			/*Function that trims each element of $scope.tags*/
			function trimTag(tag) {
				var res = JSON.stringify(tag);
				if (res.indexOf(":") == -1) {
					return res;
				}
				return res.split(":")[1].split("\"}")[0].split("\"")[1];
			}

			function initVideoSearch() {
				var $videoSearch = $("#videoSearch");
				videoSearchResult.searchString = $videoSearch.val();

				$videoSearch.on('keyup', function (keyEvent) {
					//ctrl+v ou cmd+v
					if ((!keyEvent.altKey && keyEvent.keyCode != 91) || (!keyEvent.ctrlKey && keyEvent.keyCode != 86)) {
						videoSearchResult.searchString = $(this).val();
					}
				});

				$videoSearch.on('blur', function () {
					videoSearchResult.searchString = $videoSearch.val();
				});

				$videoSearch.bind({
					paste: function (pasteEvent) {
						setTimeout(function () {
							videoSearchResult.searchString += pasteEvent.target.value;
						}, 1);
					}
				});

			}

			function findIndexByUniqueName(uniqueName) {
				for (var i = 0; i < $scope.videos.length; ++i) {
					if ($scope.videos[i].unique_name === uniqueName) {
						return i;
					}
				}
			}

			function swapVideoDivs(data) {
				var detailDisplay, emptyDisplay;
				if (data === undefined) {
					data = [];
				}
				detailDisplay = data.length === 0 ? 'none' : 'block';
				emptyDisplay = detailDisplay === 'none' ? 'block' : 'none';

				$("#no-video-loaded").css('display', emptyDisplay);
				$("div.masection.video").css('display', detailDisplay);
			}

			function updateVideoScope(index, video) {
				$scope.videos[index] = video;
			}

			function setVideoOptionFromStatus(status) {
				var $auctionLi = $("#current-video-auction");
				var $downloadLi = $("#current-video-download");
				var $deleteLi = $("#current-video-delete");
				if (status === "DOWNLOAD") {
					$auctionLi.css('display', 'none');
					if ($downloadLi.hasClass("col-md-4") && $deleteLi.hasClass("col-md-4")) {
						$downloadLi.removeClass("col-md-4").addClass("col-md-6");
						$deleteLi.removeClass("col-md-4").addClass("col-md-6");
					}
				} else {
					$auctionLi.css('display', 'block');
					if ($downloadLi.hasClass("col-md-6") && $deleteLi.hasClass("col-md-6")) {
						$downloadLi.removeClass("col-md-6").addClass("col-md-4");
						$deleteLi.removeClass("col-md-6").addClass("col-md-4");
					}
				}
			}

			function initList() {

				$scope.videos = $filter('sortBy')($scope.videos, currentSortingCriteria, true);
				// $scope.numberRows = new Array(Math.ceil($scope.videos / 2));

				swapVideoDivs($scope.videos);
				$scope.currentVideo = $scope.videos[findIndexByUniqueName($scope.currentVideo.unique_name)] || $scope.videos[0];
				$scope.currentVideoAuctionRemainingTime = initAuctionTimer();
				initMap(getVideoCoordinate());
				setVideoOptionFromStatus($scope.currentVideo.status);
				if ($scope.currentVideo.category !== null) {
					$scope.displayCategory = prefLoader.getCookie("language") === "en" ? $scope.currentVideo.category[0].translation : $scope.currentVideo.category[1].translation;
				}

				servicesAPI.getListOfTags($scope.currentVideo.unique_name).then(function (data) {
					for (var i = 0; i < data.length; ++i)
						tagsBeforeModification.push(getTranslationsForLang($scope.lang, data[i].translation)[0]);

					$scope.tags = tagsBeforeModification;
				});

				timeInterval = $interval(initAuctionTimer, 1000);

				if (doInitList) {
					initVideoPlayer();
					doInitList = false;
				}
			}

			function initAuctionTimer() {

				var vid = $scope.currentVideo;
				if (vid !== undefined && vid.auction !== undefined) {
					var timeleft = vid.auction.end - new Date();

					if (timeleft < 0) {
						return '0:00:00';
					}

					var hours = Math.floor(timeleft / (60 * 60 * 1000));
					var mins = Math.floor(timeleft / (60 * 1000) % 60);
					var secs = Math.floor((timeleft / 1000) % 60);
					if (mins < 10)
						mins = '0' + mins;
					if (mins < 5 && hours == 0) {
						$("#time").css('color', 'red');
					}

					if (secs < 10)
						secs = '0' + secs;

					$scope.currentVideoAuctionRemainingTime = hours + ':' + mins + ':' + secs;
				}
			};

			$scope.getSrcVideo = function (video) {
				servicesAPI.recupTokenVideo(video.unique_name)
					.then(function (data) {
						data = data.data;
						// console.log("data",data);
						var tok = data.viewing_token;

						// var uniqueName = $scope.currentVideo.unique_name;
						// path = '/api/videos/' + $scope.currentVideo.unique_name + '/play/' + tok + '/mp4';
						video.pathForIEMP4 = '/api/videos/' + video.unique_name + '/play/' + tok + '/mp4';

						/*$scope.videoLue = [{
							sources: [{
								src: $sce.trustAsResourceUrl(path),
								type: "video/mp4"
							}]
						}];*/
						/*$scope.controller.config = {
							preload: "none",
							autoHide: false,
							autoHideTime: 3000,
							autoPlay: true,
							sources: $scope.videoLue[0].sources,
							theme: {
								url: "vendors/videogular/videogular.css"
							},
							plugins: {
								poster: "" //define the picture appearing before we click on the play button
							}
						};*/
					});
			}

			function initVideoPlayer() {
				servicesAPI.recupTokenVideo($scope.currentVideo.unique_name)
					.then(function (data) {
						var tok = data.viewing_token;
						var uniqueName = $scope.currentVideo.unique_name;

						path = '/api/videos/' + $scope.currentVideo.unique_name + '/play/' + tok + '/mp4';
						$scope.pathForIEMP4 = '/api/videos/' + $scope.currentVideo.unique_name + '/play/' + tok + '/mp4';

						$scope.videoLue = [{
							sources: [{
								src: $sce.trustAsResourceUrl(path),
								type: "video/mp4"
							}]
						}];
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
								poster: "" //define the picture appearing before we click on the play button
							}
						};
					});
			}

			function selectLangTranslationIndex(lang) {
				switch (lang) {
					case "EN":
						return 0;
					case "FR":
						return 1;
				}
			}

			function getTranslationsForLang(lang, cats) {
				var t = [];
				for (var i = 0; i < cats.length; ++i) {
					if (cats[i].lang.toLowerCase() == lang.toLowerCase())
						t.push(cats[i]);
				}

				return t;
			}

			function translateTags(lang, tags) {
				var langList = getTranslationsForLang(lang, $scope.tagListing);
				var translated = [];

				for (var a = 0; a < tags.length; ++a) {
					for (var i = 0; i < langList.length; ++i) {
						if (tags[a].name.toUpperCase() === langList[i].name.toUpperCase()) {
							translated.push(langList[i]);
						}
					}
				}
				return translated;
			}

			/*Function that determine the current browser of the user*/
			function browserDetection(userAgent) {
				var browsers = {
					ie: /trident/i,
					edge: /edge/i,
					opera: /opera/i,
					firefox: /firefox/i,
					chrome: /chrome/i,
					safari: /safari/i
				};

				for (var key in browsers) {
					if (browsers[key].test(userAgent)) {
						return key;
					}
				};
			}

			function getVideoCoordinate() {
				var coords = $scope.currentVideo.gps_coordinates;
				var r = [];
				for (var coord in coords) {
					r.push({
						lat: coords[coord].latitude,
						lng: coords[coord].longitude
					});
				}
				return r;
			}

			servicesAPI.getTagListing().then(
				function (data) {
					console.log("tags", data);
					$scope.listTag = data.data;
				},
				function (err) {
					console.log(err);
				}
			)

			/*Function that permits to reload the sources for the video player*/
			$scope.reloadVideo = function (video, index) {
				var uniqueName = video.unique_name;

				servicesAPI.recupTokenVideo(uniqueName)
					.then(function (data) {
						data = data.data;
						var tok = data.viewing_token;
						path = '/api/videos/' + uniqueName + '/play/' + tok + '/mp4';
						var videoTag = document.getElementById("videoTag-" + index);
						var sourceMP4 = document.getElementById("sourceMP4-" + index);

						videoTag.removeChild(sourceMP4);

						var parentVideoTag = document.getElementById("parentVideoTag-" + index);
						parentVideoTag.removeChild(videoTag);

						var newVideoTag = document.createElement("video");
						var idVideo = document.createAttribute("id");
						var controlsVideo = document.createAttribute("controls");
						var heightVideo = document.createAttribute("height");
						var widthVideo = document.createAttribute("width");

						idVideo.value = "videoTag-" + index;
						controlsVideo.value = "controls";
						// heightVideo.value = "425px";
						heightVideo.value = "auto";
						widthVideo.value = "100%";

						newVideoTag.setAttributeNode(idVideo);
						newVideoTag.setAttributeNode(controlsVideo);
						newVideoTag.setAttributeNode(heightVideo);
						newVideoTag.setAttributeNode(widthVideo);
						// parentVideoTag.appendChild(newVideoTag);

						var newSourceMP4 = document.createElement("source");
						var mp4Id = document.createAttribute("id");
						mp4Id.value = "sourceMP4";

						var mp4Src = document.createAttribute("src");
						var mp4Type = document.createAttribute("type");

						mp4Type.value = "video/mp4";
						newSourceMP4.setAttributeNode(mp4Id);
						newSourceMP4.setAttributeNode(mp4Src);
						newSourceMP4.setAttributeNode(mp4Type);
						newVideoTag.appendChild(newSourceMP4);

						var player = document.getElementById('videoTag-' + index);
						var mp4Vid = document.getElementById('sourceMP4-' + index);
						// player.pause();

						// mp4Vid.src = '/api/videos/' + $scope.currentVideo.unique_name + '/play/' + tok + '/mp4';
						// player.load();
						$scope.videoLue = [{
							sources: [{
								src: $sce.trustAsResourceUrl(path),
								type: "video/mp4" || $sce.trustAsResourceUrl(path),
								type: "video/ogv" || $sce.trustAsResourceUrl(path),
								type: "video/webm"
							}]
						}];

						$scope.controller.config.sources = $scope.videoLue[0].sources;
					});
			}



			/*Function that permits to reload the sources for the video player*/
			function reloadVideo(uniqueName) {

				servicesAPI.recupTokenVideo(uniqueName)
					.then(function (data) {
						var tok = data.viewing_token;
						path = '/api/videos/' + uniqueName + '/play/' + tok + '/mp4';
						var videoTag = document.getElementById("videoTag");
						var sourceMP4 = document.getElementById("sourceMP4");

						videoTag.removeChild(sourceMP4);

						var parentVideoTag = document.getElementById("parentVideoTag");
						parentVideoTag.removeChild(videoTag);

						var newVideoTag = document.createElement("video");
						var idVideo = document.createAttribute("id");
						var controlsVideo = document.createAttribute("controls");
						var heightVideo = document.createAttribute("height");
						var widthVideo = document.createAttribute("width");

						idVideo.value = "videoTag";
						controlsVideo.value = "controls";
						heightVideo.value = "425px";
						widthVideo.value = "100%";

						newVideoTag.setAttributeNode(idVideo);
						newVideoTag.setAttributeNode(controlsVideo);
						newVideoTag.setAttributeNode(heightVideo);
						newVideoTag.setAttributeNode(widthVideo);
						parentVideoTag.appendChild(newVideoTag);

						var newSourceMP4 = document.createElement("source");
						var mp4Id = document.createAttribute("id");
						mp4Id.value = "sourceMP4";

						var mp4Src = document.createAttribute("src");
						var mp4Type = document.createAttribute("type");

						mp4Type.value = "video/mp4";
						newSourceMP4.setAttributeNode(mp4Id);
						newSourceMP4.setAttributeNode(mp4Src);
						newSourceMP4.setAttributeNode(mp4Type);
						newVideoTag.appendChild(newSourceMP4);

						var player = document.getElementById('videoTag');
						var mp4Vid = document.getElementById('sourceMP4');
						player.pause();

						mp4Vid.src = '/api/videos/' + $scope.currentVideo.unique_name + '/play/' + tok + '/mp4';
						player.load();
						$scope.videoLue = [{
							sources: [{
								src: $sce.trustAsResourceUrl(path),
								type: "video/mp4" || $sce.trustAsResourceUrl(path),
								type: "video/ogv" || $sce.trustAsResourceUrl(path),
								type: "video/webm"
							}]
						}];

						$scope.controller.config.sources = $scope.videoLue[0].sources;
					});
			}
			/*Function that intialize the google map for the current video*/
			function initMap(videoPlanCoordinates) {

				/*	if (videoPlanCoordinates.length != 0) {
						var map = new google.maps.Map(document.getElementById('map'), {
							zoom: 15,
							center: {
								lat: videoPlanCoordinates[0].lat,
								lng: videoPlanCoordinates[0].lng
							},
							mapTypeId: google.maps.MapTypeId.TERRAIN
						});

						var videoPath = new google.maps.Polyline({
							path: videoPlanCoordinates,
							geodesic: true,
							strokeOpacity: 0
						});

						videoPath.setMap(map);
					}*/
			}

			function valueSort(prop) {
				return function (a, b) {
					if (a[prop] == b[prop])
						return 0;
					return a[prop] < b[prop] ? -1 : 1;
				};
			}

		}
	]);