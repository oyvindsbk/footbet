/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var LeagueController = (function () {
        function LeagueController($scope, $rootScope, leagueService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.leagueService = leagueService;
            this.selectedLeague = this.leagues[1];
            this.loadLeagues();
        }
        LeagueController.prototype.loadLeagues = function () {
            var _this = this;
            this.leagueService.getLeagues().then(function (leagues) {
                _this.leagues = leagues;
            });
        };
        LeagueController.prototype.joinLeague = function () {
            var _this = this;
            this.leagueService.joinLeague(this.leagueCode).then(function (response) {
                if (response.isError) {
                    _this.message = response.message;
                    _this.messageClass = "error";
                }
                else
                    _this.loadLeagues();
            });
        };
        LeagueController.prototype.addCurrentUserToLeague = function () {
            var _this = this;
            this.leagueService.addCurrentUserToLeague(this.leagueName).then(function (response) {
                _this.message = response.message;
                if (response.isError) {
                    _this.messageClass = "error";
                }
                else {
                    _this.messageClass = "success";
                    _this.loadLeagues();
                }
            });
        };
        LeagueController.prototype.addNewLeague = function () {
            var _this = this;
            if (this.leagueName === "") {
                this.message = "Liganavn kan ikke være tomt";
                this.messageClass = "error";
                return;
            }
            this.leagueService.addNewLeague(this.leagueName).then(function (response) {
                _this.message = response.message;
                if (response.isError) {
                    _this.messageClass = "error";
                }
                else {
                    _this.messageClass = "success";
                    _this.loadLeagues();
                }
            });
        };
        LeagueController.prototype.showLeague = function (league) {
            this.$rootScope.$broadcast("showLeagueEvent", league);
        };
        LeagueController.$inject = [
            "$scope",
            "$rootScope"
        ];
        return LeagueController;
    })();
    Controllers.LeagueController = LeagueController;
})(Controllers || (Controllers = {}));
