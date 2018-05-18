var Services;
(function (Services) {
    "use strict";
    var LeagueService = (function () {
        function LeagueService($http) {
            this.$http = $http;
        }
        LeagueService.prototype.getLeagues = function () {
            var leagues = this.$http({
                method: "GET",
                url: "../GetLeaguesForUser"
            }).then(function (response) { return response.data; });
            return leagues;
        };
        LeagueService.prototype.joinLeague = function (leagueCode) {
            var response = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeagueByGuid",
                data: { guid: leagueCode }
            }).success(function (data) {
                if (typeof data.ExceptionMessage != "undefined") {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
            });
            return response;
        };
        LeagueService.prototype.addCurrentUserToLeague = function (leagueName) {
            var response = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeague",
                data: { leagueName: leagueName }
            }).success(function (data) {
                if (typeof data.ExceptionMessage != "undefined") {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                else {
                    response.message = "Her er din kode " + data;
                    response.isError = false;
                }
            });
            return response;
        };
        LeagueService.prototype.addNewLeague = function (leagueName) {
            var response = this.$http({
                method: "POST",
                url: "AddNewLeague",
                data: { leagueName: leagueName }
            }).success(function (data) {
                if (typeof data.ExceptionMessage != "undefined") {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                else {
                    response.message = "Her er din kode " + data;
                    response.isError = false;
                }
            });
            return response;
        };
        LeagueService.$inject = [
            "$http"
        ];
        return LeagueService;
    }());
    Services.LeagueService = LeagueService;
})(Services || (Services = {}));
//# sourceMappingURL=LeagueService.js.map