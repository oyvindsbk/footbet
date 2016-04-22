angular.module('footballCompApp.services', []).
    factory('todaysGamesService', ['$http', function($http) {
        var todaysGamesService = {};
        todaysGamesService.getPreviousGames = function (daysFromToday) {
            var todaysGames = $http({
                method: 'POST',
                url: "../TodaysGames/GetPreviousGames",
                data: { daysFromToday: daysFromToday },
            }).then(function (response) {
                if (response.ExceptionMessage != null) {
                    return false;
                };
                return response.data;
            });
            return todaysGames;
        };

        todaysGamesService.getNextGames = function (daysFromToday) {
            var todaysGames = $http({
                method: 'POST',
                url: "../TodaysGames/GetNextGames",
                data: { daysFromToday: daysFromToday },
            }).then(function (response) {
                if (response.data.ExceptionMessage != null) {
                    return null;
                }
                return response.data;
            });
            return todaysGames;
        };

        return todaysGamesService;
}]);