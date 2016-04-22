/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var UserBetController = (function () {
        function UserBetController($scope, $rootScope, $location, betBaseController) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.betBaseController = betBaseController;
            this.showSearch = true;
            betBaseController.isRequired = false;
        }
        UserBetController.$inject = [
            "$scope",
            "$http",
            "$location",
            "betBaseController"
        ];
        return UserBetController;
    })();
    Controllers.UserBetController = UserBetController;
})(Controllers || (Controllers = {}));
$scope.loadByLocation = function () {
    var url = $location.absUrl();
    var userNameByLocation = url.split("username=")[1];
    if (userNameByLocation != null) {
        $scope.showSearch = false;
        $scope.selectedUser = userNameByLocation;
        $scope.betBaseController.loadModel(userNameByLocation);
        $scope.showUserBet = true;
    }
    else {
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
;
