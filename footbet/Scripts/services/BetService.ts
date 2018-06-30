module Services {
    "use strict";

    export class BetService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) {}

        public saveBet(groups: IGroup[], playoffGames: IGame[], selectedTopScorer: IPlayer) {
            var groupGamesResultJson = this.extractGroupResultFromGroups(groups);
            var playoffGamesResultJson = this.extractPlayoffGamesFromPlayoffGames(playoffGames);
            var selectedTopScorerJson = angular.toJson(selectedTopScorer);
            var promise = this.$http({
                method: 'POST',
                url: "../Bet/SavePersonBet",
                data: {
                    groupGamesResult: groupGamesResultJson,
                    playoffGamesResult: playoffGamesResultJson,
                    selectedTopScorer: selectedTopScorerJson
                }
            }).then(response => response.data);
            return promise;
        }

        public saveBetResult(groups: IGroup[], playoffGames: IGame[], selectedTopScorer: IPlayer) {
            var groupGamesResultJson = this.extractGroupResultFromGroups(groups);
            var playoffGamesResultJson = this.extractPlayoffGamesResultFromPlayoffGames(playoffGames);

            var promise = this.$http({
                method: 'POST',
                url: "../Result/SaveResultBets",
                data: { groupGamesResult: groupGamesResultJson, playoffGamesResult: playoffGamesResultJson },
            }).then(response => response.data);
            return promise;
        }

        private extractGroupResultFromGroups (groups: IGroup[]) {
            var groupResults = [];

            angular.forEach(groups, group => {
                angular.forEach(group.games, game => {
                    if (game.homeGoals != null || game.awayGoals != null)
                        groupResults.push(game);
                });
            });

            return angular.toJson(groupResults);
        }

        private extractPlayoffGamesFromPlayoffGames (playoffGames: IGame[]) {
            var playoffGamesResults = [];

            angular.forEach(playoffGames, game => {
                if (game.homeTeam != null && game.awayTeam != null)
                    playoffGamesResults.push(game);
            });

            return angular.toJson(playoffGamesResults);
        }

        private extractPlayoffGamesResultFromPlayoffGames (playoffGames: IGame[]) {
            var playoffGamesResults = [];

            angular.forEach(playoffGames, game => {
                if (game.homeTeam != null || game.awayTeam != null)
                    playoffGamesResults.push(game);
            });

            return angular.toJson(playoffGamesResults);
        }
    }
}
    