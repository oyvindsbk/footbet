var Services;
(function (Services) {
    "use strict";
    var LeaderboardService = (function () {
        function LeaderboardService($http) {
            this.$http = $http;
        }
        LeaderboardService.prototype.getLeaderboard = function () {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetOverallLeaderboardBySportsEventId",
            }).then(function (response) { return response.data; });
            return leaderboard;
        };
        LeaderboardService.prototype.getLeaderboardForLeague = function (leagueId) {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetLeaderboardByLeagueId",
                data: { leagueId: leagueId }
            }).then(function (response) { return response.data; });
            return leaderboard;
        };
        ;
        LeaderboardService.$inject = [
            "$http"
        ];
        return LeaderboardService;
    })();
    Services.LeaderboardService = LeaderboardService;
})(Services || (Services = {}));
