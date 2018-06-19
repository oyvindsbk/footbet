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
                this.previousButtonDisabled = todaysGames.isFirstDay;
                this.nextButtonDisabled = this.isNextButtonDisabled();
                this.todaysGames = todaysGames.todaysGamesSpecification;
                this.expandGame();
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.loaded = true;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);
            });
        }

        private getNextGames() {
            this.nextButtonDisabled = true;
            this.todaysGamesService.getNextGames(this.daysFromNow).then(todaysGames => {
                this.previousButtonDisabled = false;
                this.todaysGames = todaysGames.todaysGamesSpecification;
                this.expandGame();
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);
                this.nextButtonDisabled = this.isNextButtonDisabled();
            });
        }

        private getPreviousGames() {
            this.previousButtonDisabled = true;
            this.todaysGamesService.getPreviousGames(this.daysFromNow).then(todaysGames => {
                this.previousButtonDisabled = todaysGames.isFirstDay;
                this.nextButtonDisabled = false;
                this.todaysGames = todaysGames.todaysGamesSpecification;
                this.expandGame();
                this.daysFromNow += todaysGames.numberOfDaysFromToday;
                this.todaysDate = this.getTodaysDatePlusDays(this.daysFromNow);
            });
        };

        private expandGame() {
            if (this.daysFromNow < 0)
                return;
            else if (this.daysFromNow > 0)
                this.todaysGames[0].isExpanded = true;
            else {
                for (var i = 0; i < this.todaysGames.length; i++) {
                    if (this.todaysGames[i].homeGoals === null) {
                        this.todaysGames[i].isExpanded = true;
                        break;
                    }
                }
            }

        }


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