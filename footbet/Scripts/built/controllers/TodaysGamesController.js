/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var TodaysGamesController = (function () {
        function TodaysGamesController($scope, todaysGamesService) {
            this.$scope = $scope;
            this.todaysGamesService = todaysGamesService;
            this.todaysDate = new Date();
            this.daysFromNow = 0;
            this.getNextGames();
        }
        TodaysGamesController.prototype.nextDay = function () {
            if (this.nextButtonDisabled)
                return;
            this.daysFromNow++;
            this.getNextGames();
        };
        TodaysGamesController.prototype.previousDay = function () {
            if (this.previousButtonDisabled)
                return;
            this.daysFromNow--;
            this.getPreviousGames();
        };
        TodaysGamesController.prototype.getNextGames = function () {
            var _this = this;
            this.nextButtonDisabled = true;
            this.todaysGamesService.getNextGames(this.daysFromNow).then(function (todaysGames) {
                _this.previousButtonDisabled = false;
                _this.todaysGames = todaysGames.todaysGamesSpecification;
                _this.daysFromNow += todaysGames.numberOfDaysFromToday;
                _this.todaysDate = _this.getTodaysDatePlusDays(_this.daysFromNow);
                _this.nextButtonDisabled = _this.isNextButtonDisabled();
            });
        };
        TodaysGamesController.prototype.getPreviousGames = function () {
            var _this = this;
            this.previousButtonDisabled = true;
            this.todaysGamesService.getPreviousGames(this.daysFromNow).then(function (todaysGames) {
                _this.nextButtonDisabled = false;
                _this.todaysGames = todaysGames.todaysGamesSpecification;
                _this.daysFromNow += todaysGames.numberOfDaysFromToday;
                _this.todaysDate = _this.getTodaysDatePlusDays(_this.daysFromNow);
                _this.previousButtonDisabled = _this.isPreviousButtonDisabled();
            });
        };
        ;
        TodaysGamesController.prototype.isNextButtonDisabled = function () {
            var eventEnds = new Date(2018, 6, 15);
            if (this.todaysDate.getTime() >= eventEnds.getTime()) {
                return true;
            }
            return false;
        };
        TodaysGamesController.prototype.isPreviousButtonDisabled = function () {
            var eventStarts = new Date(2018, 5, 14);
            if (this.todaysDate < eventStarts) {
                return true;
            }
            return false;
        };
        TodaysGamesController.prototype.getTodaysDatePlusDays = function (daysToAdd) {
            var date = new Date();
            return date.addDays(daysToAdd);
        };
        TodaysGamesController.$inject = [
            "$scope",
            "todaysGamesService"
        ];
        return TodaysGamesController;
    }());
    Controllers.TodaysGamesController = TodaysGamesController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("TodaysGamesController", Controllers.TodaysGamesController);
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
//# sourceMappingURL=TodaysGamesController.js.map