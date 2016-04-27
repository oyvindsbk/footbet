var Services;
(function (Services) {
    "use strict";
    var TodaysGamesService = (function () {
        function TodaysGamesService($http) {
            this.$http = $http;
        }
        TodaysGamesService.prototype.getPreviousGames = function (daysFromToday) {
            var todaysGames = this.$http({
                method: 'POST',
                url: "../TodaysGames/GetPreviousGames",
                data: { daysFromToday: daysFromToday }
            }).then(function (response) {
                if (response.ExceptionMessage != null) {
                    return false;
                }
                ;
                return response.data;
            });
            return todaysGames;
        };
        TodaysGamesService.prototype.getNextGames = function (daysFromToday) {
            var todaysGames = this.$http({
                method: 'POST',
                url: "../TodaysGames/GetNextGames",
                data: { daysFromToday: daysFromToday }
            }).then(function (response) {
                if (response.data.ExceptionMessage != null) {
                    return null;
                }
                return response.data;
            });
            return todaysGames;
        };
        ;
        TodaysGamesService.$inject = [
            "$http"
        ];
        return TodaysGamesService;
    })();
    Services.TodaysGamesService = TodaysGamesService;
})(Services || (Services = {}));
//# sourceMappingURL=TodaysGamesService.js.map