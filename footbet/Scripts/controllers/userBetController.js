footballCompApp.controller('UserBetCtrl',  ["$scope", "$http", "$location", "betBaseController", function ($scope, $http, $location, betBaseController) {
    betBaseController.isRequired = false;
    $scope.users = [];
    $scope.selectedUser = undefined;
    $scope.betBaseController = betBaseController;
    $scope.showUserBet = false;
    $scope.showSearch = true;
    $scope.errorMessage = "";

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
    $scope.searchUserBet = function() {
        $scope.showUserBet = false;

        angular.forEach($scope.users, function(user) {
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

    $scope.initializeGroupsAndPlayoffGames = function() {
        angular.forEach(betBaseController.groups, function(group) {
            betBaseController.setWinnerAndRunnerUpInGroup(group);
//            var setPlayoffGamesRecursively = false;
//            betBaseController.setPlayoffGameTeams(group, setPlayoffGamesRecursively);
        });
    };

    $scope.userBetControllerInit = function() {
        $scope.initializeGroupsAndPlayoffGames();
    };

    //Initialize
    $scope.$on('modelLoaded', function(event, mass) {
        $scope.userBetControllerInit();
    });

    $scope.getUsers = function() {
        $http({
            method: 'GET',
            url: "../User/GetUsers",
        }).success(function(users) {
            $scope.users = users;
        }).error(function() {
        });
    };
    
    $scope.loadByLocation();

}]);


