;
(function () {
	"use strict";

	m4nModule.controller('dateController', function ($scope, $interval) {

		$scope.localDate = "";
		$scope.hourLondon = 0;
		$scope.hourTokyo = 0;
		$scope.hourSydney = 0;
		$scope.hourNY = 0;
		$scope.hourFrankfurt = 0;
		$scope.relativeDayLondon = "";
		$scope.relativeDayTokyo = "";
		$scope.relativeDaySydney = "";
		$scope.relativeDayNY = "";
		$scope.relativeDayFrankfurt = ""
		$scope.minutes = 0;

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

		$scope.$watchCollection('$parent.homePageVocabulary', function (newVal, oldVal) {
			if (newVal !== undefined)
				$scope.localDate = getDateFromLanguage(newVal.language);
		});

		/*When we leave the page, we stop the loop-calling of the interval-function*/
		$scope.$on('$destroy', function () {
			// Make sure that the interval is destroyed too
			$interval.cancel(stop);
			stop = undefined;
		});

		var dateUTC = determineUTCDate();

		/*Verification of the summer or winter times. N.B.: getMonth() return the number of the month -1*/
		//We keep all details of the current UTC date to be able to manipulate it
		var currentMonth = dateUTC.getMonth();
		var currentDate = dateUTC.getDate();
		var currentHour = dateUTC.getHours();
		var currentMinute = dateUTC.getMinutes();
		var currentSecond = dateUTC.getSeconds();

		//We put seconds and minutes to 0
		dateUTC.setSeconds(0);
		dateUTC.setMinutes(0);

		//summer or winter time for London: the changes happen on the last sunday of march 1AM UTC and on the last sunday of october 1AM UTC
		//N.B: The change happen at the same moment for Frankfurt so we will use the algorithm for London to make the change for Frankfurt
		//winter to summer
		dateUTC.setMonth(2);
		dateUTC.setDate(31);

		var lastMarch = dateUTC.getDay(); //We find the day (Monday,...) corresponding to March 31st
		var lastSundayMarch = 0;
		lastSundayMarch = 31 - lastMarch;

		//We find the timestamp of the changement from winter to summer time
		dateUTC.setHours(1);
		dateUTC.setDate(lastSundayMarch);
		var londonWinterToSummerTime = dateUTC.getTime();

		//summer to winter
		dateUTC.setMonth(9);
		dateUTC.setDate(31);

		var lastOctober = dateUTC.getDay(); //We find the day (Monday,...) corresponding to October 31st
		var lastSundayOctober = 0;
		lastSundayOctober = 31 - lastOctober;

		//We find the timestamp of the changement from summer to winter time
		dateUTC.setHours(1);
		dateUTC.setDate(lastSundayOctober);
		var londonSummerToWinterTime = dateUTC.getTime();

		//summer or winter time for Sydney: the changes happen on the day before the first sunday of april 3PM UTC (caution: from summer to winter!!) and on the day before the first sunday of october 4PM UTC
		//winter to summer
		var sydneyWinterToSummerTime = 0;
		var sydneySummerToWinterTime = 0;

		dateUTC.setMonth(3);
		dateUTC.setDate(1);
		dateUTC.setHours(15);

		var firstApril = dateUTC.getDay();
		if (firstApril == 0) { //We check whether the first sunday of April is on April 1st: if it's the case, the change happens on March 31st 4PM UTC
			dateUTC.setMonth(2);
			dateUTC.setDate(31);
			sydneySummerToWinterTime = dateUTC.getTime();
		} else {
			var firstSaturdayApril = 7 - firstApril;
			dateUTC.setDate(firstSaturdayApril);
			sydneySummerToWinterTime = dateUTC.getTime();
		}

		dateUTC.setMonth(9);
		dateUTC.setDate(1);
		dateUTC.setHours(16);

		var firstOctober = dateUTC.getDay();
		if (firstOctober == 0) { //We check whether the first sunday of October is on October 1st: if it's the case, the change happens on September 30th 3PM UTC
			dateUTC.setMonth(8);
			dateUTC.setDate(30);
			sydneyWinterToSummerTime = dateUTC.getTime(); //We find the timestamp of the changement from summer to winter time
		} else {
			var firstSaturdayOctober = 7 - firstOctober;
			dateUTC.setDate(firstSaturdayOctober);
			sydneyWinterToSummerTime = dateUTC.getTime(); //We find the timestamp of the changement from summer to winter time
		}


		/*summer or winter time for NY: the changes happen on the second sunday of march 7AM UTC and on the first sunday of november 6AM UTC*/
		//We find the date of the second sunday of march and the first sunday of november for the current year
		dateUTC.setMonth(2);
		dateUTC.setDate(1);
		dateUTC.setSeconds(0);
		dateUTC.setMinutes(0);
		var firstMarch = dateUTC.getDay();
		var secondSundayMarch = 15 - firstMarch;

		//We find the timestamp of the changement from winter to summer time
		dateUTC.setHours(7);
		dateUTC.setDate(secondSundayMarch);
		var nyWinterToSummerTime = dateUTC.getTime();

		//summer to winter
		dateUTC.setDate(1)
		dateUTC.setMonth(10);
		var firstNovember = dateUTC.getDay();
		var firstSundayNovember = 8 - firstNovember;

		//We find the timestamp of the changement from summer to winter time
		dateUTC.setHours(6);
		dateUTC.setDate(firstSundayNovember);
		var nySummerToWinterTime = dateUTC.getTime();

		//We now reset the current UTC date
		dateUTC.setMonth(currentMonth);
		dateUTC.setDate(currentDate);
		dateUTC.setHours(currentHour);
		dateUTC.setMinutes(currentMinute);
		dateUTC.setSeconds(currentSecond);

		//As we knows the necessary timestamps, we now can determine if the summer time is currently used, for each city (Tokyo never changes its time)
		var londonSummerTime = false;
		var nySummerTime = false;
		var sydneySummerTime = true;

		if (dateUTC.getTime() >= nyWinterToSummerTime && dateUTC.getTime() <= nySummerToWinterTime) {
			nySummerTime = true;
		}
		if (dateUTC.getTime() >= sydneySummerToWinterTime && dateUTC.getTime() <= sydneyWinterToSummerTime) {
			sydneySummerTime = false;
		}
		if (dateUTC.getTime() >= londonWinterToSummerTime && dateUTC.getTime() <= londonSummerToWinterTime) {
			londonSummerTime = true;
		}

		var dateLondon;
		var dateNY;
		var dateTokyo;
		var dateSydney;
		var dateFrankfurt;
		var countHours = 0;
		var stop;
		stop = $interval(function () {
			$scope.minutes = determineUTCDate().getMinutes();
			if ($scope.minutes < 10) {
				$scope.minutes = "0" + $scope.minutes;
			}

			//London: UTC+1 summer, UTC+0 winter    FRANKFURT: UTC+2 summer, UTC+1 winter  We use the londonSummerTime boolean to determine the winter or summer time of Frankfurt
			dateLondon = determineUTCDate();
			dateFrankfurt = determineUTCDate();
			if (londonSummerTime) {
				//We define the exact date object for London and Frankfurt (to compare it to the local date in the dayBeforeOrAfterLocalDay function)
				dateLondon.setHours(dateLondon.getHours() + 1);
				dateFrankfurt.setHours(dateFrankfurt.getHours() + 2);
				$scope.hourLondon = dateLondon.getHours();
				$scope.hourFrankfurt = dateFrankfurt.getHours();
			} else {
				$scope.hourLondon = dateLondon.getHours();
				dateFrankfurt.setHours(dateFrankfurt.getHours() + 1);
				$scope.hourLondon = dateLondon.getHours();
				$scope.hourFrankfurt = dateFrankfurt.getHours();
			}
			if ($scope.hourLondon < 10) {
				$scope.hourLondon = "0" + $scope.hourLondon;
			}
			if ($scope.hourFrankfurt < 10) {
				$scope.hourFrankfurt = "0" + $scope.hourFrankfurt;
			}

			//We call the dayBeforeOrAfterLocalDay function to display "D+1" "D-1" or nothing according to the day of the city
			$scope.relativeDayLondon = dayBeforeOrAfterLocalDay(dateLondon);
			$scope.relativeDayFrankfurt = dayBeforeOrAfterLocalDay(dateFrankfurt);


			//Sydney: UTC+11 summer, UTC+10 winter
			dateSydney = determineUTCDate();
			if (sydneySummerTime) {
				//We define the exact date object for Sydney (to compare it to the local date in the dayBeforeOrAfterLocalDay function)
				dateSydney.setHours(dateSydney.getHours() + 11);
				$scope.hourSydney = dateSydney.getHours();
			} else {
				//We define the exact date object for Sydney (to compare it to the local date in the dayBeforeOrAfterLocalDay function)
				dateSydney.setHours(dateSydney.getHours() + 10);
				$scope.hourSydney = dateSydney.getHours();
			}
			if ($scope.hourSydney < 10) {
				$scope.hourSydney = "0" + $scope.hourSydney;
			}

			//We call the dayBeforeOrAfterLocalDay function to display "D+1" "D-1" or nothing according to the day of the city
			$scope.relativeDaySydney = dayBeforeOrAfterLocalDay(dateSydney);


			//NY: UTC-4 summer, UTC-5 winter
			dateNY = determineUTCDate();
			if (nySummerTime) {
				//We define the exact date object for NY (to compare it to the local date in the dayBeforeOrAfterLocalDay function)
				dateNY.setHours(dateNY.getHours() - 4);

				$scope.hourNY = dateNY.getHours();
			} else {
				//We define the exact date object for NY (to compare it to the local date in the dayBeforeOrAfterLocalDay function)
				dateNY.setHours(dateNY.getHours() - 5);

				$scope.hourNY = dateNY.getHours();
			}

			if ($scope.hourNY < 10) {
				$scope.hourNY = "0" + $scope.hourNY;
			}

			//We call the dayBeforeOrAfterLocalDay function to display "D+1" "D-1" or nothing according to the day of the city
			$scope.relativeDayNY = dayBeforeOrAfterLocalDay(dateNY);

			//Tokyo: always UTC+9
			dateTokyo = determineUTCDate();
			//We define the exact date object for Tokyo (to compare it to the local date in the dayBeforeOrAfterLocalDay function)
			dateTokyo.setHours(dateTokyo.getHours() + 9);
			$scope.hourTokyo = dateTokyo.getHours();
			if ($scope.hourTokyo < 10) {
				$scope.hourTokyo = "0" + $scope.hourTokyo;
			}

			//We call the dayBeforeOrAfterLocalDay function to display "D+1" "D-1" or nothing according to the day of the city
			$scope.relativeDayTokyo = dayBeforeOrAfterLocalDay(dateTokyo);
		}, 1000);

		$scope.getTimeLeft = function (index, list) {
			var vid = $scope.$parent[list][index].video || $scope.$parent[list][index];
			vid = vid[0] || vid;
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
				$(".time-" + vid.unique_name).css('color', 'red');
			}

			if (secs < 10)
				secs = '0' + secs;

			return hours + ':' + mins + ':' + secs;
		}

		function determineUTCDate() {
			var d = new Date();
			var dutc = d.toUTCString();
			var dutcarray = dutc.split(" ");
			var utcstring = "";
			switch (dutcarray[2]) {
				case "Jan":
					utcstring += "January";
					break;
				case "Feb":
					utcstring += "February";
					break;
				case "Mar":
					utcstring += "March";
					break;
				case "Apr":
					utcstring += "April";
					break;
				case "May":
					utcstring += "May";
					break;
				case "Jun":
					utcstring += "June";
					break;
				case "Jul":
					utcstring += "July";
					break;
				case "Aug":
					utcstring += "August";
					break;
				case "Sep":
					utcstring += "September";
					break;
				case "Oct":
					utcstring += "October";
					break;
				case "Nov":
					utcstring += "November";
					break;
				case "Dec":
					utcstring += "December";
					break;
			}

			utcstring += " " + dutcarray[1] + ",";
			utcstring += " " + dutcarray[3];
			utcstring += " " + dutcarray[4];
			return new Date(utcstring);
		}

		/*Function that indicates for each city whether the date corresponds to the same day, the day before or the day after compared to the local date*/
		function dayBeforeOrAfterLocalDay(dateCity) {
			var localDate = new Date();

			if (localDate.getTime() > dateCity.getTime() && localDate.getDay() != dateCity.getDay()) { //The city date correspond to the day before, comapared to the local date
				return "(D-1)";
			}
			if (localDate.getTime() < dateCity.getTime() && localDate.getDay() != dateCity.getDay()) { //The city date correspond to the day after, comapared to the local date
				return "(D+1)";
			}

			return "";
		}

		function getDateFromLanguage(lang) {
			Date.prototype.getFullProperty = function (property, propNumber) {
				return $scope.$parent.homePageVocabulary[property][propNumber];
			};
			var date = new Date();
			var day = date.getFullProperty('Days', date.getDay());
			var dayDate = date.getDate();
			var month = date.getFullProperty('Months', date.getMonth());
			var year = date.getFullYear();

			var dateString = lang == "FR" ? (day + ' ' + dayDate + ' ' + month + ' ' + year) : (day + ' ' + month + ' ' + dayDate + ' ' + year);
			return dateString;
		}

		/*
		 *  Main function to set the clock times
		 */
		(function () {
			// Initialise the locale-enabled clocks
			initInternationalClocks();
			// Initialise any local time clocks
			initLocalClocks();
			// Start the seconds container moving
			moveSecondHands();
			// Set the intial minute hand container transition, and then each subsequent step
			setUpMinuteHands();
		})();

		/*
		 *  Set up an entry for each locale of clock we want to use
		 */
		function getTimes() {
			moment.tz.add([
				'Eire|GMT IST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00',
				'Asia/Tokyo|JST|-90|0|',
				'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
			]);
			var now = new Date();
			// Set the time manually for each of the clock types we're using
			var times = [{
					jsclass: 'js-tokyo',
					jstime: moment.tz(now, "Asia/Tokyo")
				},
				{
					jsclass: 'js-london',
					jstime: moment.tz(now, "Eire")
				},
				{
					jsclass: 'js-new-york',
					jstime: moment.tz(now, "America/New_York")
				}
			];
			return times;
		}

		/*
		 * Set up the clocks that use moment.js
		 */
		function initInternationalClocks() {
			// Initialise the clock settings and the three times
			var times = getTimes();
			for (var i = 0; i < times.length; ++i) {
				var hours = times[i].jstime.format('h');
				var minutes = times[i].jstime.format('mm');
				var seconds = times[i].jstime.format('ss');

				var degrees = [{
						hand: 'hours',
						degree: (hours * 30) + (minutes / 2)
					},
					{
						hand: 'minutes',
						degree: (minutes * 6)
					},
					{
						hand: 'seconds',
						degree: (seconds * 6)
					}
				];
				for (var j = 0; j < degrees.length; j++) {
					var elements = document.querySelectorAll('.active .' + times[i].jsclass + ' .' + degrees[j].hand);
					for (var k = 0; k < elements.length; k++) {
						elements[k].style.webkitTransform = 'rotateZ(' + degrees[j].degree + 'deg)';
						elements[k].style.transform = 'rotateZ(' + degrees[j].degree + 'deg)';
						// If this is a minute hand, note the seconds position (to calculate minute position later)
						if (degrees[j].hand === 'minutes') {
							elements[k].parentNode.setAttribute('data-second-angle', degrees[j + 1].degree);
						}
					}
				}
			}
			// Add a class to the clock container to show it
			var elements = document.querySelectorAll('.clock');
			for (var l = 0; l < elements.length; l++) {
				elements[l].className = elements[l].className + ' show';
			}
		}

		/*
		 * Starts any clocks using the user's local time
		 */
		function initLocalClocks() {
			// Get the local time using JS
			var date = new Date;
			var seconds = date.getSeconds();
			var minutes = date.getMinutes();
			var hours = date.getHours();

			// Create an object with each hand and it's angle in degrees
			var hands = [{
					hand: 'hours',
					angle: (hours * 30) + (minutes / 2)
				},
				{
					hand: 'minutes',
					angle: (minutes * 6)
				},
				{
					hand: 'seconds',
					angle: (seconds * 6)
				}
			];
			// Loop through each of these hands to set their angle
			for (var j = 0; j < hands.length; j++) {
				var elements = document.querySelectorAll('.local .' + hands[j].hand);
				for (var k = 0; k < elements.length; k++) {
					elements[k].style.transform = 'rotateZ(' + hands[j].angle + 'deg)';
					// If this is a minute hand, note the seconds position (to calculate minute position later)
					if (hands[j].hand === 'minutes') {
						elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
					}
				}
			}
		}

		/*
		 * Move the second containers
		 */
		function moveSecondHands() {
			var containers = document.querySelectorAll('.bounce .seconds-container');
			setInterval(function () {
				for (var i = 0; i < containers.length; i++) {
					if (containers[i].angle === undefined) {
						containers[i].angle = 6;
					} else {
						containers[i].angle += 6;
					}
					containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
					containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
				}
			}, 1000);
			for (var i = 0; i < containers.length; i++) {
				// Add in a little delay to make them feel more natural
				var randomOffset = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
				containers[i].style.transitionDelay = '0.0' + randomOffset + 's';
			}
		}

		/*
		 * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
		 */
		function setUpMinuteHands() {
			// More tricky, this needs to move the minute hand when the second hand hits zero
			var containers = document.querySelectorAll('.minutes-container');
			var secondAngle = containers[containers.length - 1].getAttribute('data-second-angle');
			if (secondAngle > 0) {
				// Set a timeout until the end of the current minute, to move the hand
				var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
				setTimeout(function () {
					moveMinuteHands(containers);
				}, delay);
			}
		}

		/*
		 * Do the first minute's rotation, then move every 60 seconds after
		 */
		function moveMinuteHands(containers) {
			for (var i = 0; i < containers.length; i++) {
				containers[i].style.webkitTransform = 'rotateZ(6deg)';
				containers[i].style.transform = 'rotateZ(6deg)';
			}
			// Then continue with a 60 second interval
			setInterval(function () {
				for (var i = 0; i < containers.length; i++) {
					if (containers[i].angle === undefined) {
						containers[i].angle = 12;
					} else {
						containers[i].angle += 6;
					}
					containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
					containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
				}
			}, 60000);
		}



		/*
		 *  Set up an entry for each locale of clock we want to use
		 */
		function getTimes() {
			moment.tz.add([
				'Eire|GMT IST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00',
				'Asia/Tokyo|JST|-90|0|',
				'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
			]);
			var now = new Date();
			// Set the time manually for each of the clock types we're using
			var times = [{
					jsclass: 'js-tokyo',
					jstime: moment.tz(now, "Asia/Tokyo")
				},
				{
					jsclass: 'js-london',
					jstime: moment.tz(now, "Eire")
				},
				{
					jsclass: 'js-new-york',
					jstime: moment.tz(now, "America/New_York")
				}
			];
			return times;
		}


		// heure locale
		/*var tt = new Date();
		document.getElementById('seconde').style.webkitAnimationDelay = -(tt.getSeconds()) + 's';
		document.getElementById('minute').style.webkitAnimationDelay = -(tt.getMinutes() * 60 + tt.getSeconds()) + 's';
		document.getElementById('heure').style.OAnimationDelay = -((tt.getHours() % 12) * 3600 + tt.getMinutes() * 60 + tt.getSeconds()) + 's';
		document.getElementById('seconde').style.OAnimationDelay = -(tt.getSeconds()) + 's';
		document.getElementById('minute').style.OAnimationDelay = -(tt.getMinutes() * 60 + tt.getSeconds()) + 's';
		document.getElementById('heure').style.webkitAnimationDelay = -((tt.getHours() % 12) * 3600 + tt.getMinutes() * 60 + tt.getSeconds()) + 's';
		document.getElementById('seconde').style.animationDelay = -(tt.getSeconds()) + 's';
		document.getElementById('minute').style.animationDelay = -(tt.getMinutes() * 60 + tt.getSeconds()) + 's';
		document.getElementById('heure').style.animationDelay = -((tt.getHours() % 12) * 3600 + tt.getMinutes() * 60 + tt.getSeconds()) + 's';

		// heure NYC
		var nyc = new Date();
		document.getElementById('seconde').style.webkitAnimationDelay = -(nyc.getSeconds()) + 's';
		document.getElementById('minute').style.webkitAnimationDelay = -(nyc.getMinutes() * 60 + nyc.getSeconds()) + 's';
		document.getElementById('heure').style.OAnimationDelay = -((nyc.getHours() % 12) * 3600 + nyc.getMinutes() * 60 + nyc.getSeconds()) + 's';
		document.getElementById('seconde').style.OAnimationDelay = -(nyc.getSeconds()) + 's';
		document.getElementById('minute').style.OAnimationDelay = -(nyc.getMinutes() * 60 + nyc.getSeconds()) + 's';
		document.getElementById('heure').style.webkitAnimationDelay = -((nyc.getHours() % 12) * 3600 + nyc.getMinutes() * 60 + nyc.getSeconds()) + 's';
		document.getElementById('seconde').style.animationDelay = -(nyc.getSeconds()) + 's';
		document.getElementById('minute').style.animationDelay = -(nyc.getMinutes() * 60 + nyc.getSeconds()) + 's';
		document.getElementById('heure').style.animationDelay = -((nyc.getHours() % 12) * 3600 + nyc.getMinutes() * 60 + nyc.getSeconds()) + 's';

		// heure london
		var lon = new Date();
		document.getElementById('seconde').style.webkitAnimationDelay = -(lon.getSeconds()) + 's';
		document.getElementById('minute').style.webkitAnimationDelay = -(lon.getMinutes() * 60 + lon.getSeconds()) + 's';
		document.getElementById('heure').style.OAnimationDelay = -((lon.getHours() % 12) * 3600 + lon.getMinutes() * 60 + lon.getSeconds()) + 's';
		document.getElementById('seconde').style.OAnimationDelay = -(lon.getSeconds()) + 's';
		document.getElementById('minute').style.OAnimationDelay = -(lon.getMinutes() * 60 + lon.getSeconds()) + 's';
		document.getElementById('heure').style.webkitAnimationDelay = -((lon.getHours() % 12) * 3600 + lon.getMinutes() * 60 + lon.getSeconds()) + 's';
		document.getElementById('seconde').style.animationDelay = -(lon.getSeconds()) + 's';
		document.getElementById('minute').style.animationDelay = -(lon.getMinutes() * 60 + lon.getSeconds()) + 's';
		document.getElementById('heure').style.animationDelay = -((lon.getHours() % 12) * 3600 + lon.getMinutes() * 60 + lon.getSeconds()) + 's';

		// heure tokyo
		var tok = new Date();
		document.getElementById('seconde').style.webkitAnimationDelay = -(tok.getSeconds()) + 's';
		document.getElementById('minute').style.webkitAnimationDelay = -(tok.getMinutes() * 60 + tok.getSeconds()) + 's';
		document.getElementById('heure').style.OAnimationDelay = -((tok.getHours() % 12) * 3600 + tok.getMinutes() * 60 + tok.getSeconds()) + 's';
		document.getElementById('seconde').style.OAnimationDelay = -(tok.getSeconds()) + 's';
		document.getElementById('minute').style.OAnimationDelay = -(tok.getMinutes() * 60 + tok.getSeconds()) + 's';
		document.getElementById('heure').style.webkitAnimationDelay = -((tok.getHours() % 12) * 3600 + tok.getMinutes() * 60 + tok.getSeconds()) + 's';
		document.getElementById('seconde').style.animationDelay = -(tok.getSeconds()) + 's';
		document.getElementById('minute').style.animationDelay = -(tok.getMinutes() * 60 + tok.getSeconds()) + 's';
		document.getElementById('heure').style.animationDelay = -((tok.getHours() % 12) * 3600 + tok.getMinutes() * 60 + tok.getSeconds()) + 's';*/


	});
})();