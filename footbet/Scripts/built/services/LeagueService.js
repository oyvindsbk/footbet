var Services;
(function (Services) {
    "use strict";
    var LeagueService = (function () {
        function LeagueService($http) {
            this.$http = $http;
        }
        LeagueService.prototype.getLeagues = function () {
            var promise = this.$http({
                method: "GET",
                url: "GetLeaguesForUser"
            }).then(function (response) { return response.data; });
            return promise;
        };
        LeagueService.prototype.joinLeague = function (leagueCode) {
            var promise = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeagueByGuid",
                data: { guid: leagueCode }
            }).then(function (result) {
                var data = result.data;
                var response = {};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                return response;
            });
            return promise;
        };
        LeagueService.prototype.addCurrentUserToLeague = function (leagueName) {
            var result = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeague",
                data: { leagueName: leagueName }
            }).then(function (result) {
                var data = result.data;
                var response = {};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                else {
                    response.message = "KODE FOR \u00C5 BLI MED I LIGA: " + data;
                    response.isError = false;
                }
                return response;
            });
            return result;
        };
        LeagueService.prototype.addNewLeague = function (leagueName) {
            var promise = this.$http({
                method: "POST",
                url: "AddNewLeague",
                data: { leagueName: leagueName }
            }).then(function (result) {
                var data = result.data;
                var response = {};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                else {
                    response.message = "KODE FOR \u00C5 BLI MED I LIGA: " + data;
                    response.isError = false;
                }
                return response;
            });
            return promise;
        };
        LeagueService.$inject = [
            "$http"
        ];
        return LeagueService;
    }());
    Services.LeagueService = LeagueService;
})(Services || (Services = {}));
