/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class TodaysGamesController {
        message: string;
        todaysGames: Services.ITodaysGamesSpecification[];
        areDetailsShown: boolean;
        daysFromNow: number;
        todaysDate: Date = new Date();
        nextButtonDisabled: boolean;
        previousButtonDisabled: boolean;
        static $inject = [
            "$scope",
            "todaysGamesService"
        ];

        constructor(private $scope: ng.IScope,
            private todaysGamesService: Services.TodaysGamesService) {

        }

        private nextDay () {
            if (this.nextButtonDisabled) return;
            this.daysFromNow++;
            this.getNextGames();
        }

        private previousDay () {
            if (this.previousButtonDisabled) return;
            this.daysFromNow--;
            this.getPreviousGames();
        }

        private getNextGames () {
            this.todaysGamesService.getNextGames(this.daysFromNow).then(todaysGames => {
                this.previousButtonDisabled = false;
                this.todaysGames = todaysGames.todaysGamesSpecifications;
                this.nextButtonDisabled = this.isNextButtonDisabled();
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);

            });
        }

        private getPreviousGames() {
            this.todaysGamesService.getPreviousGames(this.daysFromNow).then(todaysGames => {
                this.nextButtonDisabled = false;
                this.todaysGames = todaysGames.todaysGamesSpecifications;
                this.previousButtonDisabled = this.isPreviousButtonDisabled();
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);
            });
        };


        private isNextButtonDisabled () {
            var eventEnds = new Date(2014, 6, 22);
            if (this.todaysDate.getTime() >= eventEnds.getTime()) {
                return true;
            }
            return false;
        }

        private isPreviousButtonDisabled() {
            var eventStarts = new Date(2014, 6, 10);
            if (this.todaysDate < eventStarts) {
                return true;
            }
            return false;
        }

        private getTodaysDatePlusDays (daysToAdd: number): Date {
            var date = new Date();
            return date.addDays(daysToAdd);
        }

    }
}

angular
    .module("footballCompApp")
    .controller("TodaysGamesController", Controllers.TodaysGamesController);

interface Date {
    addDays(days: number): Date;
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


