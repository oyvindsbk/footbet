footballCompApp.controller('LeaderboardCtrl', ['$scope', '$rootScope', 'leaderboardService', function ($scope, $rootScope, leaderboardService) {
    $scope.leaderboard = [];
    $scope.headerText = "";
    $rootScope.$on("showLeagueEvent", function (event, league) {
        $scope.getLeaderboardForLeague(league.Id);
        $scope.headerText = "Stilling for " + league.Name;
    });

    $scope.getLeaderboard = function () {
        leaderboardService.getLeaderboard().then(function (leaderboard) {
            $scope.leaderboard = leaderboard;
        });;
    };

    $scope.getLeaderboardForLeague = function (leagueId) {
        leaderboardService.getLeaderboardForLeague(leagueId).then(function (leaderboard) {
            $scope.leaderboard = leaderboard;
        });;
    };
}]);

