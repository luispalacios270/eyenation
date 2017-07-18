var m4nModule = angular.module('money4news.homeMedia', ['ngRoute', 'money4news.services', 'slick', "ngSanitize", "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.poster",
        "com.2fdevs.videogular.plugins.buffering", 'ui.bootstrap' /*'star-rating'*/
    ])
    /*
     * Define routing and views.
     */
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
        when("/accueil", {
            templateUrl: "resources/views/homeMedia/homeMedia.html",
            controller: "homeController"
        });
    }])
    .controller("notificationController", function ($scope, $modalInstance, message) {
        var opposingBid = message.msg[0];
        var myBid = message.msg[1];

        $scope.videoName = myBid.video[0].name;
        $scope.videoThumbnail = '../api/videos/' + myBid.video[0].unique_name + '/thumbnail';
        $scope.myBidValue = myBid.bidCurrentAmount;
        $scope.opposingValue = opposingBid.bidCurrentAmount;
        $scope.opposingMediaFaction = opposingBid.media.media.name;

        $scope.close = () => {
            $modalInstance.close();
        };

    })
    .controller("homeController", function ($interval, $scope, servicesAPI, $timeout, $sce, $modal, $cookies, $window, prefLoader, $location) {
        angular.element(document).ready(function () {

        });

        $scope.controller = this;
        $scope.controller.state = null;
        $scope.controller.API = null;
        $scope.controller.currentVideo = 0;
        $scope.videoLue = [];
        $scope.recentVideos = [];
        $scope.highestBidVideos = [];
        $scope.nearEndAuctionVideos = [];
        $scope.mostViewedVideos = [];
        $scope.userBidVideos = [];
        $scope.selectedVideo = {};
        $scope.auctionVisionning = false;
        $scope.htmlVideoUsed = false;
        $scope.videogularUsed = true;
        $scope.lang = "";
        $scope.langTranslationIndex;
        $scope.dataLoading = {};
        $scope.dataLoading.recents = false;
        $scope.dataLoading.mostViewed = false;
        $scope.dataLoading.highestBids = false;
        $scope.dataLoading.userBids = false;
        $scope.dataLoading.nearEnd = false;
        $scope.videoBoughtAmount = 0;
        $scope.creditsLeft = 0;
        $scope.controller.rating2 = 1;
        $scope.controller.isReadonly = true;
        $scope.maxVideos = 8;
        $scope.NoSeenAuction = 0;
        $scope.user = {};
        $scope.selectedIllegal = {
            name: 'blue',
            name1: '2'
        };
        $scope.specialValue = {
            "id": "12345",
            "value": "green"
        };
        $scope.select = {
            /*value: 1,*/
            choices: ["Contenu illégal.",
                "Abus d’utilisation des services.",
                "Contournement des barrières de sécurités.",
                "Autres."
            ],
            choicesViolence: ["Envers une ou plusieurs personnes",
                "Envers un enfant ou une personne vulnérable",
                "Envers un animal",
                "Des biens matériels (par exemple Vandalisme)"
            ],
            choicesDiscrimination: ["Droit à l’image",
                "Droit à la vie privée",
                "Droit à l’honneur et la réputation"
            ],
            choicesCopyRight: ["Droit d’auteur",
                "Marque de commerce",
                "Autres"
            ],
            choicesPornography: ["Juvénile",
                "Adulte"
            ]
        };
        /*$scope.optionsReports = ["Contenu illégal.",
            "Abus d’utilisation des services.",
            "Contournement des barrières de sécurités.",
            "Autres."
        ];*/
        var generalMap = {};
        var videoPlanCoordinates = [];
        var auctionTimeout;
        var userAgent = $window.navigator.userAgent;
        var categ = [];
        var tags = [];

        $scope.timer = 0;

        $scope.listnearVideos = new Array();

        /* $scope.listaPrueba = [{
                auction: {
                    end: 1494006250000

                },
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
                auction: {
                    end: 1493047155000,
                },
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
*/



        /****** Notification system initialization ******/
        (() => {
            document.addEventListener('BidUpdateNotifications', function (e) {
                var msgObj = JSON.parse(e.detail, '\\');
                var msgType = msgObj.type;
                var bidList = JSON.parse(msgObj.bidList, '\\');

                toggleNotificationView(bidList, undefined);
                updateScopeValues(bidList[0]);
            });

            function updateScopeValues(highestbid) {
                if ($scope.selectedVideo !== undefined) {
                    $scope.selectedVideo.auction.highestBid = highestbid.bidCurrentAmount; //adjusting video auction value
                    $scope.currentOffer = highestbid.bidCurrentAmount; //adjusting the current highest offer
                    $scope.initialMinimum = highestbid.bidCurrentAmount + 50; //adjusting the html input step value
                }
            }

            NotificationManager.MessageHandler.init();
            //The function is executed to get the list of languages.
            getLanguages();
        })();
        /****** End ******/

        prefLoader.getLanguage().then(
            function (resp) {
                /*console.log(resp);*/
                $scope.homePageVocabulary = resp.data.homePageVocabulary;
                $scope.auctionVocabulary = resp.data.auctionVocabulary;
                $scope.userLanguageAccountFields = resp.data.edit_account_fields;
                $scope.lang = $scope.homePageVocabulary.language.toLowerCase();
                $scope.langTranslationIndex = selectLangTranslationIndex($scope.lang.toUpperCase());
            },
            function (err) {
                console.log(err);
            }
        );

        function updateVideos() {
            $interval(function () {
                getVideosUserNews();
            }, 5000);
            getVideosUserNews();
        }

        function getVideosUserNews() {
            servicesAPI.getUserAuctionBids().then(function (resp) {
                if (resp.data != "") {
                    if ($scope.userBidVideos != null && $scope.userBidVideos.length > 0) {
                        getChangesUserBid($scope.userBidVideos, resp.data);
                    } else {
                        $scope.userBidVideos = resp.data;
                        console.log("BidVideos", resp.data);
                        $scope.NoSeenAuction = resp.data.length;
                    }
                }
            }, function (err) {
                console.log(err);
            });

        }

        updateVideos();



        if (browserDetection(userAgent) == "ie" || browserDetection(userAgent) == "edge" || browserDetection(userAgent) == "safari") {
            $scope.htmlVideoUsed = true;
            $scope.videogularUsed = false;
        }

        /*Geolocation of the media agent and initialization of the map with 10km radius around  the media agent*/
        mediaAgentGeolocalisation();


        ////////////////////////////Carousels displaying/////////////////////////


        //////////////////////////////////////////Loading of the current media agent and of the dictionnary according to the selected language//////////////
        servicesAPI.getCurrentMediaAgent().success(function (data) {
            console.log("user", data);
            $scope.mediaAgentFirstname = data.user.firstname;
            $scope.mediaAgentLastname = data.user.lastname;
            $scope.mediaCompany = data.user.media_agent.media[0].name;
            $scope.videoBoughtAmount = data.user.media_agent.bought_video_amount;
            $scope.creditsLeft = data.user.media_agent.auction_limit - data.user.media_agent.bought_video_amount - data.user.media_agent.total_temp_bid_value;
        });

        $scope.goToMyVideos = function () {
            var link = "../hosting/#/videoViewer";
            window.location.href = link;

        }

        $scope.selectLanguage = function (lang) {
            //Hide the language box after select a language
            $('#languageBox').hide();
            var auction = $scope.selectedVideo.auction;
            prefLoader.changeLanguage(lang).then(
                function (resp) {
                    $scope.homePageVocabulary = resp.data.homePageVocabulary;
                    $scope.auctionVocabulary = resp.data.auctionVocabulary;
                    $scope.userLanguageAccountFields = resp.data.edit_account_fields;
                    $scope.lang = $scope.homePageVocabulary.language.toLowerCase();
                    $scope.langTranslationIndex = selectLangTranslationIndex($scope.lang.toUpperCase());
                    if (auction == undefined)
                        $scope.currentOffer = $scope.auctionVocabulary.noOffers;
                },
                function (err) {
                    console.log(err);
                }
            );
        };

        function getChangesUserBid(localArray, newArray) {
            var flag = false;
            newArray.forEach((grandItem, grandIndex) => {
                localArray.forEach((item, index) => {
                    if (grandItem.video[0].unique_name === item.video[0].unique_name) {
                        if (!flag && grandItem.bidCurrentAmount !== grandItem.video[0].auction.highestBid && grandItem.video[0].auction.highestBid !== item.video[0].auction.highestBid) {
                            flag = true;
                            console.log("flag", flag);
                        }

                        // if(video.bidCurrentAmount=== video.video[0].auction.highestBid)
                        for (var elementValue in grandItem) {
                            if (item.hasOwnProperty(elementValue)) {
                                /*var element = object[elementValue];*/
                                item[elementValue] = grandItem[elementValue];

                            }
                        }
                    }
                });
                if (((grandIndex + 1) === newArray.length) && flag) {
                    var audio = new Audio('resources/sounds/oringz-w445.mp3');
                    audio.play();
                    $("#my-auctions").show(500);
                    $("#my-bids").hide();
                    /*$interval(function () {
                        $("#my-auctions").hide(500);
                        $("#my-bids").show();
                    }, 10000, 1);*/


                }
            });
        }

        $scope.showLangugeBox = function () {
            $('#languageBox').toggle();
        }

        $scope.showLogOutOption = function () {
            $("#logoutOption").toggle();
        };

        $scope.showMoreVideos = function () {
            $scope.maxVideos = $scope.maxVideos + 4;
        };

        $scope.getTagTranslation = function (tag) {
            var lang = $scope.lang.toLowerCase();
            for (var t in tag.translation) {
                if (tag.translation[t].lang.toLowerCase() === lang)
                    return tag.translation[t].translation;
            }
        };

        var rainbow = function () {
            var r = Math.floor((Math.random() * 255) + 0);
            var g = Math.floor((Math.random() * 255) + 0);
            var b = Math.floor((Math.random() * 255) + 0);
            var a = .125;
            return r + ',' + g + ',' + b + ',' + a;
        };

        $scope.goTop = function () {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        };

        function displayAuction(index, section) {
            $scope.displayAuction(index, section);
        }

        //variable stocking the interval for the countdown of the remaining time for the auction
        $scope.displayAuction = function (index, section) {
            //$("html, body").animate({ scrollTop: 0 }, "slow");
            console.log('Section: ' + section + ', Index: ' + index);
            $scope.goTop();
            var lattitudeAverage = 0;
            var longitudeAverage = 0;
            $("#video-info").show();
            $("#content").hide(1000);

            switch (section) {
                case "recentVideos":
                    $scope.selectedVideo = $scope.recentVideos[index];
                    $scope.auctionVisionning = true;
                    break;
                case "reporterVideos":
                    $scope.selectedVideo = $scope.reporterVideos[index];
                    $scope.auctionVisionning = true;
                    break;
                case "highestBidVideos":
                    $scope.selectedVideo = $scope.highestBidVideos[index];
                    $scope.auctionVisionning = true;
                    break;
                case "nearEndAuctionVideos":
                    $scope.selectedVideo = $scope.nearEndAuctionVideos[index];
                    $scope.auctionVisionning = true;
                    break;
                case "mostViewedVideos":
                    $scope.selectedVideo = $scope.mostViewedVideos[index];
                    $scope.auctionVisionning = true;
                    break;
                case "userBidVideos":
                    $scope.selectedVideo = $scope.userBidVideos[index].video[0];
                    $scope.auctionVisionning = true;
                    break;
            }

            /*We stock the video metadatas into the scope to display them in the auction page*/
            $scope.controller.rating2 = 2;
            var name = $scope.selectedVideo.name;
            $scope.selectedVideoTitle = name || "";

            //We calculates the average of the GPS coordinates of the selecte video to return the name of the place
            videoPlanCoordinates = [];
            for (var i = 0; i < $scope.selectedVideo.gps_coordinates.length; i++) {
                lattitudeAverage += $scope.selectedVideo.gps_coordinates[i].latitude;
                longitudeAverage += $scope.selectedVideo.gps_coordinates[i].longitude;
                videoPlanCoordinates.push({
                    lat: $scope.selectedVideo.gps_coordinates[i].latitude,
                    lng: $scope.selectedVideo.gps_coordinates[i].longitude
                });
            }

            lattitudeAverage = lattitudeAverage / $scope.selectedVideo.gps_coordinates.length;
            longitudeAverage = longitudeAverage / $scope.selectedVideo.gps_coordinates.length;
            servicesAPI.getLocationByCoordinates(lattitudeAverage, longitudeAverage).success(function (data) {
                $scope.videoPlace = data.results[1].formatted_address;
            });

            // we retrieve the remaining time and the current offer
            if ($scope.selectedVideo.auction == undefined) {
                $scope.remainingTime = "-";
                $scope.noOffers = $scope.auctionVocabulary.noOffers;
            } else {
                auctionTimeout = $interval(function () {
                    setAuctionCountdown(auctionTimeout);
                }, 1000);
                $scope.currentOffer = $scope.selectedVideo.auction.highestBid;
                $scope.leadingAuctionAmount = $scope.selectedVideo.auction.topAuctionAmount;
                servicesAPI.getUserBidForVideo($scope.selectedVideo.unique_name).then(function (resp) { //call to get user auction specs
                    $scope.selectedVideo.auction.my_last_value = resp.data.myHighestBid;
                }, function (err) {
                    console.log(err);
                });
            }

            $scope.citizenReporterName = $scope.selectedVideo.person.firstname + ' ' + $scope.selectedVideo.person.lastname;
            //We retrieve the tags of the selected video
            $scope.selectedVideoTags = "";
            for (var i = 0; i < $scope.selectedVideo.tags.length; ++i) {
                var tag = $scope.selectedVideo.tags[i];
                if (tag != undefined) {
                    $scope.selectedVideoTags += toStandardCase($scope.selectedVideo.tags[i].translation[$scope.langTranslationIndex].translation);
                    //$scope.selectedVideoTags += toStandardCase($scope.getTagTranslation( $scope.selectedVideo.tags[i] );
                    if (i != $scope.selectedVideo.tags.length - 1)
                        $scope.selectedVideoTags += ' - ';
                }
            }

            /*Part corresponding to the video player for the page with details of the selected auction*/
            servicesAPI.recupTokenVideo($scope.selectedVideo.unique_name)
                .success(function (data) {

                    $scope.token = data;
                    var tok = data.viewing_token;
                    var uniqueName = $scope.selectedVideo.unique_name;
                    path = '/api/videos/' + $scope.selectedVideo.unique_name + '/play/' + tok + '/mp4';

                    var videoTag = document.getElementById("videoTag");
                    var sourceMP4 = document.getElementById("sourceMP4");
                    var parentVideoTag = document.getElementById("parentVideoTag");
                    var newVideoTag = document.createElement("video");
                    var idVideo = document.createAttribute("id");
                    var controlsVideo = document.createAttribute("controls");
                    var heightVideo = document.createAttribute("height");
                    var widthVideo = document.createAttribute("width");
                    var player = document.getElementById('videoTag');
                    var mp4Vid = document.getElementById('sourceMP4');
                    var newSourceMP4 = document.createElement("source");
                    var mp4Id = document.createAttribute("id");
                    var mp4Src = document.createAttribute("src");
                    var mp4Type = document.createAttribute("type");

                    videoTag.removeChild(sourceMP4);
                    parentVideoTag.removeChild(videoTag);
                    idVideo.value = "videoTag";
                    controlsVideo.value = "controls";
                    heightVideo.value = "425px";
                    widthVideo.value = "100%";
                    newVideoTag.setAttributeNode(idVideo);
                    newVideoTag.setAttributeNode(controlsVideo);
                    newVideoTag.setAttributeNode(heightVideo);
                    newVideoTag.setAttributeNode(widthVideo);
                    parentVideoTag.appendChild(newVideoTag);
                    mp4Id.value = "sourceMP4";
                    mp4Type.value = "video/mp4";
                    newSourceMP4.setAttributeNode(mp4Id);
                    newSourceMP4.setAttributeNode(mp4Src);
                    newSourceMP4.setAttributeNode(mp4Type);
                    newVideoTag.appendChild(newSourceMP4);

                    //change of the video source
                    player.pause();

                    //Now simply set the 'src' property of the mp4Vid webmVid et ogvVid variable
                    //Source paths for the html video tag
                    mp4Vid.src = '/api/videos/' + uniqueName + '/play/' + tok + '/mp4';
                    player.load();

                    $scope.videoLue = [{
                        sources: [{
                            src: $sce.trustAsResourceUrl(path),
                            type: "video/mp4" || $sce.trustAsResourceUrl(path),
                            type: "video/ogv" || $sce.trustAsResourceUrl(path),
                            type: "video/webm"
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
                            poster: ""
                        }
                    };
                });

            /*We load the other videos of the citizen reporter*/
            categ = JSON.stringify([]);
            tags = JSON.stringify([]);
            servicesAPI.getVideos(0, categ, tags, "DESC", 'USER', $scope.selectedVideo.person.email, '').success(function (data) {
                $scope.reporterVideos = data;
                $scope.dataLoading.userBids = true;
                setTimeout(function () {
                    $(".shader").hover(function () {
                        var color = rainbow();
                        $(this).css('background-color', 'rgba(' + color + ')');

                    });
                    console.log($scope.reporterVideos);
                    for (var vid in $scope.reporterVideos) {
                        var uniqueName = $scope.reporterVideos[vid].unique_name;
                        var $reporterVid = $("#reporterVideo" + uniqueName);
                        var path = '../api/videos/' + uniqueName + '/thumbnail';
                        $reporterVid.css('background-image', "url(" + path + ")").css('background-size', '100% 100%');
                    }
                    initMapBySelector({
                        lat: videoPlanCoordinates[0].lat,
                        lng: videoPlanCoordinates[0].lng
                    }, "#mapSelectedVideo", 15, {
                        geodesic: true
                    }, []);
                }, 50);

            });
            setTimeout(false);
            initViewCountIncrementOnVideoClick();
            initAuctionButtonClick();
            initAuctionInputStep();
            if ($scope.selectedVideo.auction != null)
                $scope.remainingTimeSelected = (Math.floor(($scope.selectedVideo.auction.end - new Date()) / 1000)) + $scope.timer;
            else
                $scope.remainingTimeSelected = 0;
        }

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }



        $scope.getCurrentTime = function () {
            var d = new Date();
            var h = addZero(d.getHours());
            var m = addZero(d.getMinutes());
            var s = addZero(d.getSeconds());
            var result = h + ":" + m + ":" + s;
            return result;
        }

        $scope.getTimeLeftCounters = function (time, item) {
            var timeleft = time - new Date();
            if (timeleft < 0) {
                if (item != null) {
                    $scope.recentVideos.splice(item, 1);
                }
                return '0:00:00';
            }
            var hours = Math.floor(timeleft / (60 * 60 * 1000));
            var mins = Math.floor(timeleft / (60 * 1000) % 60);
            var secs = Math.floor((timeleft / 1000) % 60);
            if (mins < 10)
                mins = '0' + mins;
            /*if (mins < 5 && hours == 0) {
            	$(".time-" + vid.unique_name).css('color', 'red');
            }*/
            if (secs < 10)
                secs = '0' + secs;
            return hours + ':' + mins + ':' + secs;
        }

        $scope.getSecundsVideo = function (time) {
            return (Math.floor((time - new Date().getTime()) / 1000)) + $scope.timer;
        }

        $scope.getStatesByCurrentCountry = function (countryCode) {
            servicesAPI.getStates(countryCode)
                .success(function (data) {
                    console.log("states", data);
                    $scope.listStates = data.states;
                    console.log($scope.listStates);
                    // $('select').material_select('destroy');
                    $('select').material_select();
                });
        }


        $scope.returnToVideosList = function () {
            // $window.location.reload();
            $("#video-info").hide();
            $("#content").show(1000);
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
            $scope.nameNecesary = false;
            $scope.emailNecesary = false;
            $scope.firstnameNecesary = false;
            $scope.lastnameNecesary = false;
            $scope.phoneNecesary = false;
            $scope.addressNecesary = false;
            $scope.townNecesary = false;

            if (user.name == undefined) {
                $scope.nameNecesary = true;

            }

            if (user.email == undefined) {
                $scope.emailNecesary = true;

            }

            if (user.firstname == undefined) {
                $scope.firstnameNecesary = true;

            }

            if (user.lastname == undefined) {
                $scope.lastnameNecesary = true;

            }

            if (user.telephone == undefined) {
                $scope.phoneNecesary = true;

            }

            if (user.address == undefined) {
                $scope.addressNecesary = true;

            }

            if (user.town == undefined) {
                $scope.townNecesary = true;

            }

            if ($scope.nameNecesary || $scope.emailNecesary || $scope.firstnameNecesary || $scope.lastnameNecesary || $scope.phoneNecesary || $scope.addressNecesary || $scope.townNecesary) {
                return;

            }


            // We verify if the username contain between 8 and 20 characters            
            if (user.name.length != 0 && (user.name.length < 8 || user.name.length > 20)) {
                $scope.nameLenghtNotValid = true;
                return;
            }


            //We check if the telephone format is valid
            //N.B: for  french cell phones, numbers start with 06 or 07 (+336 or +337 with the international indicator)
            //As the attribute in the Person Table is called "cell_phone_number" in the DB, only cell phones are accepted
            //for a french user
            // var pattern = $scope.paysList[user.country].phonePattern;
            // var phoneEntered = user.telephone;

            // var tel = phoneEntered.split(" ").join('')

            // var re = new RegExp($scope.paysList[user.country].phonePattern)
            // if (tel.match(re) == null) {
            //     $scope.telExamples = $scope.paysList[user.country].phoneExamples;
            //     $scope.telFormatInvalid = true;
            //     return;
            // }

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
                        user.telephone,
                        user.address,
                        user.city,
                        user.country,
                        user.state,
                        user.language)
                    .success(function () {
                        /*console.log("aprobado");*/
                        $cookies.put("modifOk", "1");
                        $scope.modalSelected = 0;
                        $('#correctEdit').show(500);
                        $interval(function () {
                            $('#grand-modal').modal('close');
                            $('#correctEdit').hide();
                        }, 2000, 1);
                        // $('#grand-modal').modal('close');
                        //$location.path("/");

                    })
                    .error(function () {
                        console.log("error");
                        $scope.modificationPb = true;
                    })


            } else {

                servicesAPI.editAccount(
                        user.name,
                        user.email,
                        user.firstname,
                        user.lastname,
                        user.telephone,
                        user.address,
                        user.city,
                        user.country,
                        user.state,
                        user.language)
                    .success(function () {
                        $cookies.put("modifOk", "1");
                        $scope.modalSelected = 0;
                        $('#correctEdit').show(500);
                        $interval(function () {
                            $('#grand-modal').modal('close');
                            $('#correctEdit').hide();
                        }, 2000, 1);
                        // $('#grand-modal').modal('close');
                        //$location.path("/");

                    })
                    .error(function (err) {
                        console.log(err);
                        $scope.modificationPb = true;
                    })


            }

        };



        //The function is executed to get the list of languages.
        // getLanguages();





        $scope.showModals = function (option) {
            console.log("modal");
            $('.modal').modal();
            $('select').material_select();
            $('#grand-modal').modal('open');
            $scope.modalSelected = option;
            /*switch (option) {
                case 1:
                    $('#modal-purchase-protection').modal('open');
                    break;
                case 2:
                    $('#modal-help-purchases').modal('open');
                    break;
                case 3:
                    $('#modal-sale-tools').modal('open');
                    break;
                case 4:
                    $('#modal-mobile-eyenation').modal('open');
                    break;
                case 5:
                    $('#modal-edit-user').modal('open');
                    break;
                default:
                    break;
            }*/
        }

        $scope.minizeAuction = function (option) {
            console.log("Entro")
            if (option === 1) {
                $("#my-auctions").hide(500);
                $("#my-bids").show(500);
            } else if (option === 2) {
                $("#my-auctions").hide(500);
            } else if (option === 3) {
                $("#my-bids").hide(250);
                $("#my-auctions").show(250);
            } else if (option === 4) {
                $("#my-bids").toggle(250);
                $("#my-auctions").toggle(250);
                $scope.NoSeenAuction = 0;
            }
        }

        $scope.alreadyMadeBid = function () {
            return $scope.selectedVideo != undefined && $scope.selectedVideo.auction != undefined && $scope.selectedVideo.auction.my_last_value != undefined;
        }

        $scope.hasHighestBid = function () {
            return $scope.selectedVideo.auction != undefined && $scope.selectedVideo.auction.highestBid == $scope.selectedVideo.auction.my_last_value
        }

        $scope.showAuctionBidVideo = function (index) {
            return $scope.userBidVideos[index].video[0].auction.end > new Date().getTime();
        };

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

        $scope.pruebaMayor = function () {
            getInformationSelect();
        };

        function getNearEndVideosRecent() {
            $interval(function () {
                for (var i = 0; i < $scope.recentVideos.length; i++) {
                    var element = $scope.recentVideos[i];
                    if (element.auction != undefined)
                        if ((Math.floor((element.auction.end - new Date().getTime()) / 1000)) <= 300) {
                            $scope.recentVideos[i].showNear = true;
                        }
                }
            }, 1000);
        }

        /*function getNearEndVideosRecent() {
            $interval(function () {
                for (var i = 0; i < $scope.listaPrueba.length; i++) {
                    var element = $scope.listaPrueba[i];
                    if (element.auction != undefined)
                        if ((Math.floor((element.auction.end - new Date().getTime()) / 1000)) <= 300) {
                            $scope.listaPrueba[i].showNear = true;
                        }
                }
            }, 1000);
        }*/

        //Set the markers once the videos are ready
        $scope.$watch("recentVideos", function (newVal, old, scope) {
            /* if (newVal != old && $scope.recentVideos.length > 0)
                 $scope.prepareMarks();*/
            if (newVal != null && $scope.recentVideos.length > 0) {
                variable++;
                if (variable >= 2) {
                    /*getNearEndVideos();*/
                    $scope.prepareMarks();
                    getNearEndVideosRecent();
                }
            }
        });

        function getNearEndVideos() {
            $interval(function () {
                for (var i = 0; i < $scope.nearEndAuctionVideos.length; i++) {
                    var element = $scope.nearEndAuctionVideos[i];
                    if ((Math.floor((element.auction.end - new Date().getTime()) / 1000)) <= 300) {
                        $scope.nearEndAuctionVideos[i].showNear = true;
                    }
                }
            }, 1000);
        }

        var variable = 0;

        $scope.$watch("nearEndAuctionVideos", function (newVal, old, scope) {
            if (newVal != old && $scope.nearEndAuctionVideos.length > 0) {
                variable++;
                if (variable >= 2) {
                    getNearEndVideos();
                }
            }
        });


        //When the document is loaded the timer for the countdowns start.
        angular.element(document).ready(function () {
            // materializeInit();
            $interval(function () {
                $scope.timer = $scope.timer + 1;
            }, 1000);
            $scope.prepareMarks();
            getNearEndVideosRecent();
            materializeInit();
            /*$scope.recentVideos = listaPrueba*/
        });

        $scope.initDropdown = function () {
            // console.log(id);
            // $(".dropdown-button").dropdown('open');
            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            });
            /*$('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            });*/


        }

        function materializeInit() {
            console.log("initialization");
            $('.modal').modal();
            $('select').material_select();
            /*$('.dropdown-button').dropdown('open');*/
            /* $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            });*/

            $(document).mouseup(function (e) {
                var container = $("#tagsBox");

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    container.hide();
                }
            });
        }

        /*function jqueryAnimationsInit() {
            $('#profile-icon').click(function () {

            });
        }*/


        function toStandardCase(string) {
            return string[0].toUpperCase() + string.substr(1).toLowerCase();
        }

        // Get list of languages and countries to modify account
        function getLanguages() {
            servicesAPI.verifAuthentifie().success(function (data) {
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
                $scope.getStatesByCurrentCountry();
            });
            servicesAPI.recupLangues().success(function (data) {
                $scope.langueList = data;
            }).error(function () {
                alert("Erreur chargement des langues");
            });
            servicesAPI.recupLocalization().success(function (data) {
                $scope.paysList = data;

            }).error(function () {
                alert("Erreur chargement des pays");
            });
        }

        /*$scope.listStates = getStatesByCurrentCountry();*/

        function initViewCountIncrementOnVideoClick() {
            var $mediaplayer = $("#mediaplayer");

            $mediaplayer.unbind('click');
            $mediaplayer.click(function (clickEvent) {
                $mediaplayer.unbind('click');
                var videoUniqueName = $scope.selectedVideo.unique_name;
                servicesAPI.incrementVideoViewCount(videoUniqueName).then(
                    function (resp) {
                        updateViewCountArrays(videoUniqueName);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            });
        }

        $scope.makeBid = function (bidAmount, video) {
            // bidAmount = $("#auction-amount-input").val();
            /*var maxBidAutoAmount = $("#auction-amount-max-auto-input").val();*/
            var maxBidAutoAmount = 0;
            /*var videoUniqueName = $scope.selectedVideo.unique_name;*/
            var videoUniqueName = video.unique_name;
            var auction = video.auction;

            if (bidAmount % 50 !== 0) {
                console.log("The amaount must be a multiple of 50");
                return;

            }


            if (maxBidAutoAmount == "")
                maxBidAutoAmount = 0;

            if (isNaN(parseInt(bidAmount)) || isNaN(parseInt(maxBidAutoAmount))) {
                console.log("Amounts must contain numeric characters.");
                return;
            }

            if (bidAmount == "")
                amount = 0;

            if (auction == undefined) {
                servicesAPI.createAuction(videoUniqueName, bidAmount, maxBidAutoAmount).then(
                    function (resp) {

                        var startTime = new Date();
                        var endTime = new Date();
                        endTime.setHours(startTime.getHours() + 4);

                        $scope.currentOffer = bidAmount;
                        $scope.initialMinimum = parseInt(bidAmount) + 50;
                        $scope.selectedVideo.auction = {
                            end: endTime,
                            start: startTime,
                            highestBid: bidAmount,
                            media: $scope.selectedVideo.person.media_agent.media.name
                        };
                        $scope.userBidVideos.push({
                            bidAmountInitial: bidAmount,
                            bidCurrentAmount: bidAmount,
                            bidDateTime: new Date().getTime(),
                            bidMaximumAmount: null,
                            video: [$scope.selectedVideo]
                        });
                        $scope.remainingTime = '3:59:59';
                        auctionTimeout = $interval(function () {
                            setAuctionCountdown(auctionTimeout);
                        }, 1000);

                        $scope.NoSeenAuction++;
                        $scope.remainingTimeSelected = (Math.floor(($scope.selectedVideo.auction.end - new Date()) / 1000)) + $scope.timer;

                    },
                    function (err) {
                        console.log(err);
                    }
                );
            } else {
                servicesAPI.makeABid(videoUniqueName, bidAmount, maxBidAutoAmount).then(
                    function (resp) {

                        /*var lastBid = $scope.selectedVideo.auction.my_last_value || 0;*/
                        var index = findIndexByUniqueName(videoUniqueName, $scope.userBidVideos);

                        /*$scope.currentOffer = bidAmount;*/
                        /*$scope.selectedVideo.auction.my_last_value = bidAmount;*/
                        $scope.initialMinimum = parseInt(bidAmount) + 50;

                        // if (index !== undefined) {
                        $scope.userBidVideos[index].bidCurrentAmount = bidAmount;
                        $scope.userBidVideos[index].video[0].auction.highestBid = bidAmount;
                        /*} else {
                            $scope.userBidVideos.push({
                                bidAmountInitial: bidAmount,
                                bidCurrentAmount: bidAmount,
                                bidDateTime: new Date().getTime(),
                                bidMaximumAmount: null,
                                video: [$scope.selectedVideo]
                            });
                        }*/

                        $scope.creditsLeft -= (bidAmount);
                        /*$scope.NoSeenAuction++;*/

                        // $scope.remainingTimeSelected = (Math.floor(($scope.selectedVideo.auction.end - new Date()) / 1000)) + $scope.timer;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }

        }

        function initAuctionButtonClick() {
            $submitAuctionBtn = $("#submitAuctionBtn");
            $submitAuctionBtn.unbind();
            $submitAuctionBtn.click(function () {
                var bidAmount = $("#auction-amount-input").val();
                var maxBidAutoAmount = $("#auction-amount-max-auto-input").val();
                var videoUniqueName = $scope.selectedVideo.unique_name;
                var auction = $scope.selectedVideo.auction;

                if (bidAmount % 50 !== 0) {
                    console.log("The amaount must be a multiple of 50");
                    return;

                }

                if (maxBidAutoAmount == "")
                    maxBidAutoAmount = 0;

                if (isNaN(parseInt(bidAmount)) || isNaN(parseInt(maxBidAutoAmount))) {
                    console.log("Amounts must contain numeric characters.");
                    return;
                }

                /*//The auction view is shown for 10 secs then is closed.
                $("#my-auctions").show(500);
                $("#my-bids").hide();
                $interval(function () {
                    $("#my-auctions").hide(500);
                    $("#my-bids").show();
                }, 10000, 1);*/

                /*if (maxBidAutoAmount == "")
                    maxBidAutoAmount = 0;*/

                if (bidAmount == "")
                    amount = 0;

                if (auction == undefined) {
                    servicesAPI.createAuction(videoUniqueName, bidAmount, maxBidAutoAmount).then(
                        function (resp) {

                            var startTime = new Date();
                            var endTime = new Date();
                            endTime.setHours(startTime.getHours() + 4);

                            $scope.currentOffer = bidAmount;
                            $scope.initialMinimum = parseInt(bidAmount) + 50;
                            $scope.selectedVideo.auction = {
                                end: endTime,
                                start: startTime,
                                highestBid: bidAmount,
                                media: $scope.selectedVideo.person.media_agent.media.name
                            };
                            $scope.userBidVideos.push({
                                bidAmountInitial: bidAmount,
                                bidCurrentAmount: bidAmount,
                                bidDateTime: new Date().getTime(),
                                bidMaximumAmount: null,
                                video: [$scope.selectedVideo]
                            });
                            $scope.remainingTime = '3:59:59';
                            auctionTimeout = $interval(function () {
                                setAuctionCountdown(auctionTimeout);
                            }, 1000);

                            $scope.NoSeenAuction++;
                            $scope.remainingTimeSelected = (Math.floor(($scope.selectedVideo.auction.end - new Date()) / 1000)) + $scope.timer;
                            //The auction view is shown for 10 secs then is closed.
                            $("#my-auctions").show(500);
                            $("#my-bids").hide();
                            $interval(function () {
                                $("#my-auctions").hide(500);
                                $("#my-bids").show();
                            }, 10000, 1);

                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                } else {
                    servicesAPI.makeABid(videoUniqueName, bidAmount, maxBidAutoAmount).then(
                        function (resp) {

                            var lastBid = $scope.selectedVideo.auction.my_last_value || 0;
                            var index = findIndexByUniqueName(videoUniqueName, $scope.userBidVideos);

                            $scope.currentOffer = bidAmount;
                            $scope.selectedVideo.auction.my_last_value = bidAmount;
                            $scope.initialMinimum = parseInt(bidAmount) + 50;

                            if (index !== undefined) {
                                $scope.userBidVideos[index].bidCurrentAmount = bidAmount;
                                $scope.userBidVideos[index].video[0].auction.highestBid = bidAmount;
                            } else {
                                $scope.userBidVideos.push({
                                    bidAmountInitial: bidAmount,
                                    bidCurrentAmount: bidAmount,
                                    bidDateTime: new Date().getTime(),
                                    bidMaximumAmount: null,
                                    video: [$scope.selectedVideo]
                                });
                            }

                            $scope.creditsLeft -= (bidAmount - lastBid);
                            $scope.NoSeenAuction++;
                            $scope.remainingTimeSelected = (Math.floor(($scope.selectedVideo.auction.end - new Date()) / 1000)) + $scope.timer;
                            //The auction view is shown for 10 secs then is closed.
                            $("#my-auctions").show(500);
                            $("#my-bids").hide();
                            $interval(function () {
                                $("#my-auctions").hide(500);
                                $("#my-bids").show();
                            }, 10000, 1);
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                }
            });
        }

        function loadLastCategory() {
            $("#" + prefLoader.getCookie('last_category')).trigger('click');
        }

        function initAuctionInputStep() {
            $scope.initialMinimum = ($scope.selectedVideo.auction != undefined ? $scope.selectedVideo.auction.highestBid + 50 : 50);
            $amountAuctionInput = $("#auction-amount-input");
            $amountAuctionInput.val('');
            $("#auction-amount-max-auto-input").val('');
            $amountAuctionInput.attr('min', ($scope.selectedVideo.auction !== undefined) ? $scope.selectedVideo.auction.highestBid + 50 : 50);
        }

        function setAuctionCountdown(state) {
            if ($scope.selectedVideo.auction == undefined)
                return;
            var auction = $scope.selectedVideo.auction;
            var timeleft;
            if (auction !== undefined) {
                var timeleft = auction.end - new Date();

                if (timeleft < 0) {
                    $interval.cancel(state);
                    return; //auction ended
                }

                $times = $("#time2-" + $scope.selectedVideo.unique_name);
                var hours = Math.floor(timeleft / (60 * 60 * 1000));
                var mins = Math.floor(timeleft / (60 * 1000) % 60);
                var secs = Math.floor((timeleft / 1000) % 60);
                if (mins < 10)
                    mins = '0' + mins;
                if (mins < 5 && hours == 0)
                    $times.addClass('remaining-time');
                else {
                    if ($times.hasClass('remaining-time')) $times.removeClass('remaining-time');
                }

                if (secs < 10)
                    secs = '0' + secs;

                time = hours + ':' + mins + ':' + secs;

                $scope.remainingTime = time;
            }
        }

        function findIndexByUniqueName(videoUniqueName, videoList) {
            for (var i = 0; i < videoList.length; ++i) {
                var bid = videoList[i].video;
                var vid;
                if (bid != undefined)
                    vid = bid[0];
                else
                    vid = videoList[i];
                if (vid.unique_name === videoUniqueName) {
                    return i;
                }
            }
        }

        $scope.prepareMarks = function () {
            $scope.recentVideos.forEach(function (item, index) {
                var marker = new google.maps.Marker({
                    map: $scope.generalMap,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: {
                        lat: item.gps_coordinates[0].latitude,
                        lng: item.gps_coordinates[0].longitude
                    },
                    title: item.name
                });
                marker.addListener('click', function () {
                    $scope.displayAuction(index, 'recentVideos');
                });
            });
        };

        function selectLangTranslationIndex(lang) {
            switch (lang) {
                case "EN":
                    return 0;
                case "FR":
                    return 1;
            }
        }

        function updateViewCountArrays(videoUniqueName) {

            var actualViewCount = $scope.selectedVideo.times_viewed;
            var index = findIndexByUniqueName(videoUniqueName, $scope.recentVideos);
            if (index != undefined) {
                $scope.recentVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.nearEndAuctionVideos)
            if (index !== undefined) {
                $scope.nearEndAuctionVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.reporterVideos);
            if (index != undefined) {
                $scope.reporterVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.mostViewedVideos);
            if (index != undefined) {
                $scope.mostViewedVideos[index].times_viewed += 1;
            }

            index = findIndexByUniqueName(videoUniqueName, $scope.highestBidVideos);
            if (index != undefined) {
                $scope.highestBidVideos[index].times_viewed += 1;
            }

            if (actualViewCount + 1 != $scope.selectedVideo.times_viewed)
                $scope.selectedVideo.times_viewed += 1;
        }

        /*Function that intialize the google map for the media bombs*/
        function initMapBySelector(coordinates, mapSelector, zoom, mapConfig, geolocationMediaAgent) {
            var mapElem = $(mapSelector)[0]; //COMMENT RECUPERER VALEUR DE CE TRUC ???????
            //var posCenter=coordinates;
            //alert(mapElem.value)
            var map = new google.maps.Map(mapElem, {
                zoom: zoom,
                center: {
                    lat: coordinates.lat,
                    lng: coordinates.lng
                },
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

            $scope.generalMap = map;

            if (mapSelector == "#map") {

                var infoWindow = new google.maps.InfoWindow({
                    map: map
                });
                circleColor = '#81BEF7';
                var circleOption = {
                    strokeColor: circleColor,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: circleColor,
                    fillOpacity: 0.35,
                    map: map,
                    clickable: false,
                    center: {
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    },
                    radius: 10000
                };

                if (geolocationMediaAgent == "failureLocalization") {
                    // alert("Problème de localisation de l'agent média")
                } else {
                    //circle = new google.maps.Circle(circleOption);

                    /*infoWindow.setPosition({
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    });*/
                    if (geolocationMediaAgent == "geoLocalized") {
                        infoWindow.setContent('You are currently here.');
                    }
                    if (geolocationMediaAgent == "homeLocalized") {
                        //infoWindow.setContent('Immediate localization is not allowed by the browser. Here is your office.');
                    }
                    map.setCenter(coordinates);
                    //$scope.prepareMarks();
                }



                /*We put the blue round to mark the exact position of the media agent*/
                var iconBase = 'resources/images/';
                var icons = {
                    currentPosition: {
                        icon: iconBase + '32.png'
                    }
                };

                /*var markeri = new google.maps.Marker({
                    map: map,
                    position: {
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    },
                    icon: icons.currentPosition.icon                    
                });
                markeri.setMap(map);*/

                /*We add the markers corresponding to the recent videos*/
                $scope.recentVideos.forEach((item, index) => {
                    var lattitudeAverage = 0;
                    var longitudeAverage = 0;
                    var nbVideoCoordinates = item.gps_coordinates.length;

                    for (var j = 0; j < nbVideoCoordinates; j++) {
                        lattitudeAverage += item.gps_coordinates[j].latitude;
                        longitudeAverage += item.gps_coordinates[j].longitude;
                    }

                    lattitudeAverage = lattitudeAverage / nbVideoCoordinates;
                    longitudeAverage = longitudeAverage / nbVideoCoordinates;

                    var marker = new google.maps.Marker({
                        position: {
                            lat: lattitudeAverage,
                            lng: longitudeAverage
                        },
                        title: item.name
                    });

                    // To add the marker to the map, call setMap();
                    marker.setMap(map);
                    marker.addListener('click', function () {
                        $scope.displayAuction(index, 'recentVideos');
                    });

                });
                /* for (var i = 0; i < $scope.recentVideos.length; i++) {
                     var lattitudeAverage = 0;
                     var longitudeAverage = 0;
                     var nbVideoCoordinates = $scope.recentVideos[i].gps_coordinates.length;

                     for (var j = 0; j < nbVideoCoordinates; j++) {
                         lattitudeAverage += $scope.recentVideos[i].gps_coordinates[j].latitude;
                         longitudeAverage += $scope.recentVideos[i].gps_coordinates[j].longitude;
                     }
                     lattitudeAverage = lattitudeAverage / nbVideoCoordinates;
                     longitudeAverage = longitudeAverage / nbVideoCoordinates;

                     var marker = new google.maps.Marker({
                         position: {
                             lat: lattitudeAverage,
                             lng: longitudeAverage
                         },
                         title: $scope.recentVideos[i].name
                     });

                     // To add the marker to the map, call setMap();
                     marker.setMap(map);
                     marker.addListener('click', function () {
                         $scope.displayAuction(i, 'recentVideos');
                     });
                 }*/


            } else {
                var marker = new google.maps.Marker({
                    map: $scope.generalMap,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: {
                        lat: $scope.selectedVideo.gps_coordinates[0].latitude,
                        lng: $scope.selectedVideo.gps_coordinates[0].longitude
                    },
                    title: $scope.selectedVideo.name
                });

            }



            var config = new google.maps.Polyline(mapConfig);

            config.setMap(map);
        }

        function initMaps(mapObjects) {
            for (var map in mapObjects) {
                initMapBySelector(mapObjects[map].coordinates, mapObjects[map].selector, mapObjects[map].zoom, mapObjects[map].config, []);
            }
        }

        function toggleNotificationView(msg, msgType) {

            var modal = $modal.open({
                templateUrl: 'resources/views/homeMedia/notificationModal.html',
                backdrop: 'static',
                dialogFade: true,
                controller: 'notificationController',
                resolve: {
                    message: function () {
                        return {
                            msg: msg,
                            msgType: msgType
                        };
                    }
                }
            });

        }

        function mediaAgentGeolocalisation() {
            /*if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                    };
                    initMapBySelector(pos, "#map", 9, {geodesic:true},"geoLocalized");// the media agent's device has effectively been localized
        
                    //alert(JSON.stringify(res[0]));
        
                })
        
            }else{*/
            var address = '';
            servicesAPI.getCurrentMediaAgent().success(function (data) {
                console.log(data);
                data = data.user;
                /*address += data.localization.street.replace(/ /g, "+");
                address += ',+';*/
                address += data.localization.city.replace(/ /g, "+");
                address += ',+';
                address += data.localization.country_fips.replace(/ /g, "+");
                //alert(address);                
                servicesAPI.getMediaAgentHomeCoordinates(address).success(function (data) {
                    console.log(data);

                    var homeCoordinates = data.results[0].geometry.location;

                    //alert(JSON.stringify("ghjklm"+data.results.geometry))
                    //$scope.azertyuiop=JSON.stringify(data.results[0].geometry);
                    initMapBySelector(homeCoordinates, "#map", 9, {
                        geodesic: true
                    }, "homeLocalized"); // the media agent's device has not effectively been localized but home is found
                })
            }).error(function () {
                initMapBySelector({
                    lat: 0,
                    lng: 0
                }, "#map", 0, {
                    geodesic: true
                }, "failureLocalization"); //neither the instantaneous nor the home localization worked
                location.href = "../";
            });


            //}
            //alert("ghjklm"+res)
            //return res;
        }
        /*servicesAPI.getCurrentMediaAgent().success(function(data){
            alert(JSON.stringify(data));
        });*/
    });