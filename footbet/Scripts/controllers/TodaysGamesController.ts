/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class TodaysGamesController {
        message: string;
        todaysGames: Services.ITodaysGamesSpecification[];
        areDetailsShown: boolean;
        loaded: boolean;
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
            this.daysFromNow = 0;

            this.loadTodaysGames();
        }

        private nextDay() {
            if (this.nextButtonDisabled) return;
            this.daysFromNow++;
            this.getNextGames();
        }

        private previousDay() {
            if (this.previousButtonDisabled) return;
            this.daysFromNow--;
            this.getPreviousGames();
        }

        private loadTodaysGames() {
            this.nextButtonDisabled = true;
            this.previousButtonDisabled = true;
            this.todaysGamesService.getNextGames(this.daysFromNow).then(todaysGames => {
                if (!todaysGames.isFirstDay)
                    this.previousButtonDisabled = true;
                this.nextButtonDisabled = this.isNextButtonDisabled();
                this.todaysGames = todaysGames.todaysGamesSpecification;
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.loaded = true;
            });
        }

        private getNextGames() {
            this.nextButtonDisabled = true;
            this.todaysGamesService.getNextGames(this.daysFromNow).then(todaysGames => {
                this.previousButtonDisabled = false;
                this.todaysGames = todaysGames.todaysGamesSpecification;
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);
                this.nextButtonDisabled = this.isNextButtonDisabled();
            });
        }

        private getPreviousGames() {
            this.previousButtonDisabled = true;
            this.todaysGamesService.getPreviousGames(this.daysFromNow).then(todaysGames => {
                this.nextButtonDisabled = false;
                this.todaysGames = todaysGames.todaysGamesSpecification;
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);
                this.previousButtonDisabled = this.isPreviousButtonDisabled();
            });
        };


        private isNextButtonDisabled() {
            var eventEnds = new Date(2018, 6, 15);
            if (this.todaysDate.getTime() >= eventEnds.getTime()) {
                return true;
            }
            return false;
        }

        private isPreviousButtonDisabled() {
            var eventStarts = new Date(2018, 5, 14);
            if (this.todaysDate < eventStarts) {
                return true;
            }
            return false;
        }

        private getTodaysDatePlusDays(daysToAdd: number): Date {
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

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}