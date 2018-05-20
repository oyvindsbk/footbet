/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";
    export class LeaderboardController {
        leaderboard: Services.ILeaderboard;
        headerText: string = "";
        numberOfIncompleteGames: number = 0;
        userBetIncompleteMessage: string;

        static $inject = [
            "$scope",
            "$rootScope",
            "leaderboardService"
        ];

        constructor(private $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private leaderboardService: Services.LeaderboardService) {
            this.$rootScope.$on("showLeagueEvent", (event, league: Services.ILeague) => {
                this.getLeaderboardForLeague(league.id);
                this.headerText = "Stilling for " + league.name;
            });
        }


        private getLeaderboard() {
            this.leaderboardService.getLeaderboard().then(leaderboard => {
                this.leaderboard = leaderboard;
            });
        }

        private getLeaderboardForLeague(leagueId: number) {
            this.leaderboardService.getLeaderboardForLeague(leagueId).then(leaderboard => {
                this.leaderboard = leaderboard;
            });
        }
    }
}

angular
    .module("footballCompApp")
    .controller("LeaderboardController", Controllers.LeaderboardController);
