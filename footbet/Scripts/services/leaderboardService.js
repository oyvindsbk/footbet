angular.module('footballCompApp.services', []).
    factory('leaderboardService', ['$http', function($http) {
        var leaderboardService = {};
        leaderboardService.getLeaderboard = function () {
            var leaderboard = $http({
                method: 'POST',
                url: "../Leaderboard/GetOverallLeaderboardBySportsEventId",
                data: {},
            }).then(function (response) {
                return response.data;
            });
            return leaderboard;
        };

        leaderboardService.getLeaderboardForLeague = function (leagueId) {
            var leaderboard = $http({
                method: 'POST',
                url: "../Leaderboard/GetLeaderboardByLeagueId",
                data: {leagueId : leagueId},
            }).then(function (response) {
                return response.data;
            });
            return leaderboard;
        };

    return leaderboardService;
}]);