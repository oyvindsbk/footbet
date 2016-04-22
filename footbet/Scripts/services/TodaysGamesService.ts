module Services {
    "use strict";

    export class TodaysGamesService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) { }

        private getPreviousGames (daysFromToday: number) : IGame[]{
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

        private getNextGames(daysFromToday: number): IGame[] {
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