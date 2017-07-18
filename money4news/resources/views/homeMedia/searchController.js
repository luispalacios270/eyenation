;
(function () {
	"use strict";

	m4nModule.controller('searchController', function ($scope, servicesAPI, prefLoader, $interval) {

		$scope.category;
		$scope.categoriesSelected = [];
		$scope.categories = [];
		$scope.categoriesPerColumn = 0;
		$scope.tags = [];
		$scope.tagListing = [];
		$scope.indexes = {};
		$scope.indexes.recentVideos = 0;
		$scope.indexes.highestBidVideos = 0;
		$scope.indexes.mostViewedVideos = 0;
		$scope.indexes.nearEndAuctionVideos = 0;
		$scope.searchOption = 1
		$scope.selectedTags = new Array();
		var queryString = '';
		var stop;
		/* Scope Functions */
		$scope.getCategory = function (categ, event) {
			categ = categ === 'ALL' ? undefined : categ;
			$scope.category = categ;
			$("#video-search-bar").val("");
			queryString = "";
			dataload();
			if (angular.isDefined(stop)) {
				$interval.cancel(stop);
				// stop = undefined;
			}
			stop = $interval(function () {
				dataload();
			}, 5000);
			defineCategory(categ, event);
			if ($scope.$parent.auctionVisionning == true) {
				$scope.$parent.auctionVisionning = false;
				$scope.$parent.selectedVideo = undefined;
			}
		};

		/*function contains(array, grandItem) {
			if (array.length > 0)
				array.forEach((item, index) => {
					if (item === grandItem)
						return index;
					if ((index + 1) === array.length) {
						return -1;
					}
				});
			else
				return -1;
		}*/

		$scope.showTags = function () {
			$("#tagsBox").toggle();
		};

		$scope.addTagParam = function (tag, event) {
			$(event.target).hide(1000);
			$("#tagsBox").toggle | (1000);
			$scope.selectedTags.push(tag);
			/*console.log($scope.selectedTags);*/
			toggleTag(event.target, tag.name);
			dataload();
		};

		// Add or remove a category to the list of categories, then reload the data.
		$scope.addCategoryToList = function (categ, event) {
			/*var arrayTemp = $scope.categoriesSelected;
			var flag = contains(arrayTemp, categ);
			if (flag != -1) {
				console.log("Is not in array")
				$scope.categoriesSelected.push(categ);
				$scope.getCategory(categ, event);
			} else {
				console.log("In addCategoryToList.")
				$scope.categoriesSelected.splice(flag, 1);
				$scope.getCategory(categ, event);
			}*/
			if ($scope.categoriesSelected.length > 0)
				$scope.categoriesSelected.forEach((item, index) => {
					if (item === categ) {
						/*console.log("In addCategoryToList.")*/
						$scope.categoriesSelected.splice(index, 1);
						$scope.getCategory(categ, event);
						return;
					}
					if ((index + 1) === $scope.categoriesSelected.length) {
						$scope.categoriesSelected.push(categ);
						$scope.getCategory(categ, event);
						return;
					}
				});
			else {
				$scope.categoriesSelected.push(categ);
				$scope.getCategory(categ, event);
				return;
			}
		};



		$scope.changeSearchOption = function (option) {
			if (isNaN(option) || option > 2 || option < 1 || option === $scope.searchOption)
				return;

			$scope.searchOption = option;
		};
		/* End Scope Functions */

		/* INITIALIZATION ROUTINE */
		/***************************************************************************************************/
		init();
		initSearch();
		/***************************************************************************************************/
		/* END INITIALIZATION ROUTINE */

		/* Private Functions */
		function init() {
			servicesAPI.getCategoryListing().then(function (resp) {
				$scope.categories = resp.data.sort(valueSort('translation'));
				//Prepare the number of categories by the number of columns
				$scope.categoriesPerColumn = Math.ceil($scope.categories.length / 3);
			}, function (err) {
				console.log(err);
			});

			servicesAPI.getTagListing().then(function (resp) {
				$scope.tagListing = resp.data.sort(valueSort('translation'));
			}, function (err) {
				console.log(err);
			});
			/*if (prefLoader.checkCookie('last_category')) {
				var categ = prefLoader.getCookie('last_category');
				$scope.getCategory(categ);
				defineCategory(categ);
			} else {
				$scope.getCategory();
			}*/
			$scope.getCategory();
		}

		function initSearch() {

			var $search = $("#video-search-bar");
			var $btn = $("#s-icon");

			$search.on('keyup', function (e) {
				queryString = e.target.value;
				if (e.keyCode == 13)
					$btn.trigger('click');
			});

			$btn.on('click', function (e) {
				dataload();
			});
		}

		function getChangesUserBid(localArray, newArray) {
			/*newArray.forEach((grandItem, grandIndex) => {
				var flag = false;
				localArray.forEach((item, index) => {
					if (grandItem.unique_name === item.unique_name) {
						flag = true;
						for (var elementValue in grandItem) {							
							item[elementValue] = grandItem[elementValue];
						}
						return;
					}
					if (((index + 1) === localArray.length) && !flag) {
						localArray.push(grandItem);

					}					
				});

			});*/
		}

		function getVideosWithParams(order, filter, email, list, videoName) {
			// var cats = [];
			var cats = $scope.categoriesSelected;
			var tagz = $scope.tags.length != 0 ? $scope.tags : [];
			/*$scope.$parent[list] = [];*/
			if ($scope.category != undefined)
				cats.push($scope.category);
			/*console.log("Categories: ");
			console.log(cats);*/

			servicesAPI.getVideos($scope.indexes[list], JSON.stringify(cats), JSON.stringify(tagz), order, filter, email, videoName).then(function (resp) {
				console.log("videos",resp.data);
				if ($scope.$parent[list] == null || $scope.$parent[list].length == 0)
					$scope.$parent[list] = resp.data;
				else
					getChangesUserBid($scope.$parent[list], resp.data);

				// console.log($scope.$parent);


			}, function (err) {
				console.log(err);
			});
		}

		function loadCarousels(videoListsConfig) {
			for (var config in videoListsConfig) {
				$scope.$parent.dataLoading[videoListsConfig[config].dataLoadingParam] = false;
				getVideosWithParams(videoListsConfig[config].order, videoListsConfig[config].filter, videoListsConfig[config].email, videoListsConfig[config].list, videoListsConfig[config].videoName);
				$scope.$parent.dataLoading[videoListsConfig[config].dataLoadingParam] = true;
			}
		}

		function reinitSlick(list, slickConfig) {
			var $slick = $("slick[data*=" + list + "]");
			$slick.slick('unslick');
			$slick.slick(slickConfig);

			$slick.find(".slick-dots").css('display', slickConfig.dots === true ? 'block' : 'none');
			$slick.find("button").css('display', slickConfig.dots === true ? 'block' : 'none');
			$slick.attr('slides-to-show', slickConfig.slidesToShow);
			$slick.attr('slides-to-scroll', slickConfig.slidesToScroll);
		}

		function defineCategory(categ, event) {
			categ = categ || 'ALL'
			if (event !== undefined) {
				// var $elem = $(".categ-selected");
				// $elem.removeClass("categ-selected");
				//$('li').removeClass('category-selected');
				$(event.target).toggleClass('category-selected');
				prefLoader.setCookie('last_category', categ, 30);
				setSelected(categ, "#category-filter", "categ-selected", false);
			} else {
				setTimeout(function () {
					setSelected(categ, "#category-filter", "categ-selected", false);
				}, 250);
			}
		}

		function toggleTag(elem, tag) {
			var removed = $(elem).hasClass('tag-selected');

			setSelected(tag, '#tag-filter', 'tag-selected', true);
			if (removed)
				$scope.tags.splice($scope.tags.indexOf(tag), 1);
			else
				$scope.tags.push(tag);
		}

		function setSelected(name, filter, styleClass, multiple) {
			var selection = $(filter).find(".flex-filter");

			for (var i = 0; i < selection.length; ++i) {
				var nameValue = $(selection[i]).attr('name-value');
				name = (name === undefined) ? "ALL" : name;

				if (nameValue === name) {
					if ($(selection[i]).hasClass(styleClass) && multiple)
						$(selection[i]).removeClass(styleClass);
					else
						$(selection[i]).addClass(styleClass);
				} else {
					if (!multiple && $(selection[i]).hasClass(styleClass))
						$(selection[i].removeClass(styleClass));
				}
			}
		}

		function dataload() {
			loadCarousels({
				recent: {
					order: 'DESC',
					filter: 'VIDEO_STATUS_LAST_TIME_CHANGED',
					email: '',
					list: 'recentVideos',
					dataLoadingParam: "recents",
					videoName: queryString.toLowerCase()
				},
				bid: {
					order: 'DESC',
					filter: 'BID',
					email: '',
					list: 'highestBidVideos',
					dataLoadingParam: "highestBids",
					videoName: queryString.toLowerCase()
				},
				views: {
					order: 'DESC',
					filter: 'VIEWS',
					email: '',
					list: 'mostViewedVideos',
					dataLoadingParam: "mostViewed",
					videoName: queryString.toLowerCase()
				},
				auction_time: {
					order: 'ASC',
					filter: 'AUCTION_ENDING_DATE',
					email: '',
					list: 'nearEndAuctionVideos',
					dataLoadingParam: "nearEnd",
					videoName: queryString.toLowerCase()
				}
			});
		}

		function valueSort(prop) {
			return function (a, b) {
				if (a[prop] == b[prop])
					return 0;
				return a[prop] < b[prop] ? -1 : 1;
			};
		}
	});

})();