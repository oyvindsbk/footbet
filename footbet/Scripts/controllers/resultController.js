footballCompApp.controller('ResultCtrl', ["$scope", "betBaseController", "betService", function ($scope, betBaseController, betService) {
    $scope.betBaseController = betBaseController;
    $scope.betBaseController.isRequired = false;
    $scope.message = "";
    $scope.saveResultBets = function () {
        betService.saveBetResult($scope.betBaseController.groups, $scope.betBaseController.playoffGames).then(function (response) {
            $scope.message = response;
        });
    };

    $scope.initializeGroupsAndPlayoffGames = function() {
        angular.forEach($scope.betBaseController.groups, function (group) {
            $scope.betBaseController.setWinnerAndRunnerUpInGroup(group);

//            var setPlayoffGamesRecursively = false;
//            $scope.betBaseController.setPlayoffGameTeams(group, setPlayoffGamesRecursively);
        });
    };

    $scope.userBetControllerInit = function () {
        $scope.initializeGroupsAndPlayoffGames();
    };

    //Initialize
    $scope.$on('modelLoaded', function (event, mass) {
         $scope.userBetControllerInit();
    });
   
}]);

