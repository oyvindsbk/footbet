module Services {
    "use strict";

    export class LeaderboardService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) {}

        private getLeaderboard(): ILeaderboard {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetOverallLeaderboardBySportsEventId",
                data: {},
            }).then(response => response.data);
            return leaderboard;
        }

        private getLeaderboardForLeague(leagueId: number): ILeaderboard {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetLeaderboardByLeagueId",
                data: { leagueId: leagueId }
            }).then(response => response.data);
            return leaderboard;
        };
    }
}