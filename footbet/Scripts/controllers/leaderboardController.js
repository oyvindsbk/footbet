/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var LeaderboardController = (function () {
        function LeaderboardController($scope, $rootScope, leaderBoardService) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.leaderBoardService = leaderBoardService;
            this.headerText = "";
            this.numberOfIncompleteGames = 0;
            this.$rootScope.$on("showLeagueEvent", function (event, league) {
                _this.getLeaderboardForLeague(league.Id);
                _this.headerText = "Stilling for " + league.Name;
            });
        }
        LeaderboardController.prototype.getLeaderboard = function () {
            var _this = this;
            this.leaderboardService.getLeaderboard().then(function (leaderboard) {
                _this.leaderboard = leaderboard;
            });
        };
        LeaderboardController.prototype.getLeaderboardForLeague = function (leagueId) {
            var _this = this;
            this.leaderboardService.getLeaderboardForLeague(leagueId).then(function (leaderboard) {
                _this.leaderboard = leaderboard;
            });
        };
        LeaderboardController.$inject = [
            "$scope",
            "$rootScope",
            "leaderboardService"
        ];
        return LeaderboardController;
    })();
    Controllers.LeaderboardController = LeaderboardController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("LeaderboardController", Controllers.LeaderboardController);
