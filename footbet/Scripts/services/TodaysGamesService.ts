module Services {
    "use strict";

    export class TodaysGamesService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) { }

        public getPreviousGames (daysFromToday: number) : ng.IPromise<ITodaysGames>{
            var todaysGames = this.$http({
                method: 'POST',
                url: "../TodaysGames/GetPreviousGames",
                data: { daysFromToday: daysFromToday }
            }).then(response => {
                if (response.ExceptionMessage != null) {
                    return false;
                };
                return response.data;
            });
            return todaysGames;
        }

        public getNextGames(daysFromToday: number): ng.IPromise<ITodaysGames> {
            var todaysGames = this.$http({
                method: 'POST',
                url: "../TodaysGames/GetNextGames",
                data: { daysFromToday: daysFromToday }
            }).then(response => {
                if (response.data.ExceptionMessage != null) {
                    return null;
                }
                return response.data;
            });
            return todaysGames;
        };
    }
}