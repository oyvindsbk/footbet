/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class UserBetController {
        errorMessage: string;
        users: Services.IUser[];
        selectedUser: Services.IUser;
        showUserBet: boolean;
        showSearch: boolean = true;
        static $inject = [
            "$scope",
            "$http",
            "$location",
            "betBaseController"
        ];

        constructor(private $scope: ng.IScope,
            private $rootScope: ng.IHttpService,
            private $location: ng.ILocationService,
            private betBaseController: Services.BetBaseController) {
            betBaseController.isRequired = false;

        }


    }
}


$scope.loadByLocation = function () {
        var url = $location.absUrl();
        var userNameByLocation = url.split("username=")[1];
        if (userNameByLocation != null) {
            $scope.showSearch = false;
            $scope.selectedUser = userNameByLocation;
            $scope.betBaseController.loadModel(userNameByLocation);
            $scope.showUserBet = true;

        } else {
            $scope.getUsers();
        }
    };
    $scope.searchUserBet = function () {
        $scope.showUserBet = false;

        angular.forEach($scope.users, function (user) {
            if (user.UserName == $scope.selectedUser) {
                $scope.betBaseController.loadModel(user.UserName);
                $scope.errorMessage = "";
                $scope.showUserBet = true;
            }
        });

        if (!$scope.showUserBet) {
            $scope.errorMessage = "Fant ikke bruker, vennligst søk med fullstendig brukernavn";
        }
    };

    $scope.initializeGroupsAndPlayoffGames = function () {
        angular.forEach(betBaseController.groups, function (group) {
            betBaseController.setWinnerAndRunnerUpInGroup(group);
        });
    };

    $scope.userBetControllerInit = function () {
        $scope.initializeGroupsAndPlayoffGames();
    };

    $scope.$on('modelLoaded', function (event, mass) {
        $scope.userBetControllerInit();
    });

    $scope.getUsers = function () {
        $http({
            method: 'GET',
            url: "../User/GetUsers",
        }).success(function (users) {
            $scope.users = users;
        }).error(function () {
        });
    };

    $scope.loadByLocation();

}]);


