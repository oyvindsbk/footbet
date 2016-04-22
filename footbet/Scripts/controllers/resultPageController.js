footballCompApp.controller('ResultPageCtrl', ["$scope", "$http", "$rootScope", "betBaseController", function ($scope, $http, $rootScope, betBaseController) {
    $scope.betBaseController = betBaseController;

    $scope.loadResult = function() {
        $http({
            url: "../ResultPage/GetResults",
            method: "POST",
        }).success(function(betViewModel) {
            betBaseController.groups = betViewModel.Groups;
            betBaseController.initializeGroupsForBet();
            betBaseController.initializePlayoffGamesForBet(betViewModel.PlayoffGames);
            $rootScope.$broadcast('modelLoaded', true);
        }).error(function(data, status) {
            betBaseController.errorMessage = status;
        });
    };

    $scope.initializeGroupsAndPlayoffGames = function () {
        angular.forEach(betBaseController.groups, function (group) {
            betBaseController.setWinnerAndRunnerUpInGroup(group);
            betBaseController.setPlayoffGameTeams(group);
        });
    };

    //Initialize
    $scope.resultPageControllerInit = function () {
        $scope.initializeGroupsAndPlayoffGames();
    };

    $scope.$on('modelLoaded', function (event, mass) {
        $scope.resultPageControllerInit();
    });

    $scope.loadResult();

}]);
