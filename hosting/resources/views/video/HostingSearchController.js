(function () {
	"use strict";

	videoModule.controller("HostingSearchController", function ($scope) {

		var videos;
		var queryString = '';

		initSearch();


		function initSearch() {
			var $btn = $("#s-icon");
			var $input = $("#search-bar").find("input");

			$btn.click(search);
			$input.on('keyup', search);

		}

		function search(e) {
			var txt = $("#search-bar").find("input").val();
			$scope.$parent.videos = searchOnProp('name', txt);

			var descriptionSearchVideos = searchOnProp('description', txt);
			addNonExistingObjects($scope.$parent.videos, descriptionSearchVideos);
			var tagzSearchVideos = searchIn(txt, 'tags');
			addNonExistingObjects($scope.$parent.videos, tagzSearchVideos);
			var categorySearch = searchIn(txt, 'category');
			addNonExistingObjects($scope.$parent.videos, categorySearch);
		}

		function searchOnProp(prop, string) {
			var results = [];
			videos = $scope.$parent.searchVideos;

			for (var vid in videos) {
				var propertyValue = videos[vid][prop];
				if (propertyValue !== null && propertyValue !== undefined) {
					propertyValue = propertyValue.toLowerCase();
					if (propertyValue.indexOf(string.toLowerCase()) !== -1)
						results.push(videos[vid]);
				}
			}

			return results;

		}

		function searchIn(string, array) {
			var results = [];
			var items;
			videos = $scope.$parent.searchVideos;

			for (var vid in videos) {

				if (array === 'tags') {
					var addedOnce = false;
					items = videos[vid][array];
					if (items !== null) {
						for (var item in items) {

							var name = items[item].translation[getTagTranslation($scope.lang)].translation.toLowerCase();
							if (name !== undefined) {
								if (name.indexOf(string.toLowerCase()) !== -1 && !addedOnce) {
									results.push(videos[vid]);
									addedOnce = true;

								}
							}
						}
					}

				} else {
					var cat = videos[vid].category;
					if (cat !== null)
						if (cat[getTagTranslation($scope.lang)].name.toLowerCase().indexOf(string.toLowerCase()) !== -1)
							results.push(videos[vid]);
				}

			}
			console.log(results);
			return results;
		}

		function addNonExistingObjects(objArray, comparedArray) {

			for (var toAdd in comparedArray) {
				var exists = false;

				for (var current in objArray) {

					if (comparedArray[toAdd].unique_name === objArray[current].unique_name) {
						exists = true;
					}

				}

				if (!exists)
					objArray.push(comparedArray[toAdd]);

			}
		}

		function getTagTranslation(lang) {
			switch (lang.toLowerCase()) {
				case "en":
					return 0;
				default:
					return 1;
			}
		}

	});

})();