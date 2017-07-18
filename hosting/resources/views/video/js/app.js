angular.module('eyenation', [
        'ngMaterial',
        'ngMessages',
        'ngAnimate'
    ]).directive('myEnter', function () {
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
    .controller('homeCtrl', ['$scope', '$mdMenu', '$mdDialog', function ($scope, $mdMenu, $mdDialog) {

        $scope.miniTags = ["Pape", /*"Pope", "religion", "assassinat", "couteau", */ "knife", "catholiscisme", "DaVinci Code"];
        $scope.tags = {
            list: ["Fire", "Politics"],
            readOnly: true
        };
        $scope.title = "Tentative d’assassinat sur le Pape";
        $scope.reduceTag = function (index, majorIndex) {
            $scope.vids[majorIndex].miniTags.splice(index, 1);
        };
        $scope.addTag = function (tag, index) {
            $scope.vids[index].miniTags.push(tag);
            $scope.prueba = '';
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
                $scope.vids.splice(index, 1);
            }, function () {
                /*$scope.status = 'You decided to keep your debt.';*/
            });




        }

        $scope.vids = [{
            title: "Tentative d’ assassinat sur le Pape",
            date: "30 nov. 16 11:19",
            place: "Limoilou, Québec (Canada)",
            tags: {
                list: ["Fire", "Politics"],
                readOnly: true
            },
            auctioned: false,
            miniTags: ["Pape", "Pope", "religion", "DaVinci Code"]
        }, {
            title: "Tentative d’ assassinat sur le Pape",
            date: "30 nov. 16 11:19",
            place: "Limoilou, Québec (Canada)",
            tags: {
                list: ["Fire", "Politics"],
                readOnly: true
            },
            miniTags: ["Pape", "Pope", "religion", "DaVinci Code"]
        }, {
            title: "Tentative d’ assassinat sur le Pape",
            date: "30 nov. 16 11:19",
            place: "Limoilou, Québec (Canada)",
            tags: {
                list: ["Fire", "Politics"],
                readOnly: true
            },
            miniTags: ["Pape", "Pope", "religion", "DaVinci Code"]
        }]

        $scope.openMenu = function ($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };

        function putVideoAuction() {

        }

        $scope.showDialog = function (ev, index) {
            var confirm = $mdDialog.confirm()
                .title('Auction Video')
                .textContent("confirmez-vous que vous voulez mettre cette video a l'enchère?")
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Accept')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                $scope.vids[index].auctioned = true;
            }, function () {
                /*$scope.status = 'You decided to keep your debt.';*/
            });

        }

        $scope.closeEdit = function (i) {
            switch (i) {
                case 1:


                    break;

                case 2:

                    break;

                default:
                    break;
            }
            $scope.selectedPencil = false;
        };
    }]);