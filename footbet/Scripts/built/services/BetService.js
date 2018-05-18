var Services;
(function (Services) {
    "use strict";
    var BetService = (function () {
        function BetService($http) {
            this.$http = $http;
        }
        BetService.prototype.saveBet = function (groups, playoffGames) {
            var groupGamesResultJson = this.extractGroupResultFromGroups(groups);
            var playoffGamesResultJson = this.extractPlayoffGamesResultFromPlayoffGames(playoffGames);
            var promise = this.$http({
                method: 'POST',
                url: "../Bet/SavePersonBet",
                data: { groupGamesResult: groupGamesResultJson, playoffGamesResult: playoffGamesResultJson }
            }).then(function (response) { return response.data; });
            return promise;
        };
        BetService.prototype.saveBetResult = function (groups, playoffGames) {
            var groupGamesResultJson = this.extractGroupResultFromGroups(groups);
            var playoffGamesResultJson = this.extractPlayoffGamesResultFromPlayoffGames(playoffGames);
            var promise = this.$http({
                method: 'POST',
                url: "../Result/SaveResultBets",
                data: { groupGamesResult: groupGamesResultJson, playoffGamesResult: playoffGamesResultJson }
            }).then(function (response) { return response.data; });
            return promise;
        };
        BetService.prototype.extractGroupResultFromGroups = function (groups) {
            var groupResults = [];
            angular.forEach(groups, function (group) {
                angular.forEach(group.games, function (game) {
                    if (game.homeGoals != null || game.awayGoals != null)
                        groupResults.push(game);
                });
            });
            return angular.toJson(groupResults);
        };
        BetService.prototype.extractPlayoffGamesResultFromPlayoffGames = function (playoffGames) {
            var playoffGamesResults = [];
            angular.forEach(playoffGames, function (game) {
                if (game.homeTeam != null || game.awayTeam != null)
                    playoffGamesResults.push(game);
            });
            return angular.toJson(playoffGamesResults);
        };
        BetService.$inject = [
            "$http"
        ];
        return BetService;
    }());
    Services.BetService = BetService;
})(Services || (Services = {}));
//# sourceMappingURL=BetService.js.map