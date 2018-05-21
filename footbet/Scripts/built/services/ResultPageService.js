var Services;
(function (Services) {
    "use strict";
    var ResultPageService = (function () {
        function ResultPageService($http) {
            this.$http = $http;
        }
        ResultPageService.prototype.loadResult = function () {
            var response = this.$http({
                url: "../ResultPage/GetResults",
                method: "POST"
            }).error(function (data, status) {
                return status;
            });
            return response;
        };
        ResultPageService.prototype.getLeaderboardForLeague = function (leagueId) {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetLeaderboardByLeagueId",
                data: { leagueId: leagueId }
            }).then(function (response) { return response.data; });
            return leaderboard;
        };
        ;
        ResultPageService.$inject = [
            "$http"
        ];
        return ResultPageService;
    }());
    Services.ResultPageService = ResultPageService;
})(Services || (Services = {}));
