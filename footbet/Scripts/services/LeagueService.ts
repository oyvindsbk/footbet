module Services {
    "use strict";

    export class LeagueService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) {}

        getLeagues(): ng.IPromise<ILeague[]> {
            var leagues = this.$http({
                method: "GET",
                url: "../GetLeaguesForUser"
            }).then(response => response.data);
            return leagues;
        }

        joinLeague(leagueCode: string): ng.IPromise<IResponse> {
            var response = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeagueByGuid",
                data: { guid: leagueCode }
            }).success(data => {
                if (typeof data.ExceptionMessage != "undefined") {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
            });
            return response;
        }

        addCurrentUserToLeague(leagueName: string): ng.IPromise<IResponse> {
            var response = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeague",
                data: { leagueName: leagueName }
            }).success(data => {
                if (typeof data.ExceptionMessage != "undefined") {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                } else {
                    response.message = `Her er din kode ${data}`;
                    response.isError = false;
                }
            });
            return response;
        }

        addNewLeague(leagueName: string): ng.IPromise<IResponse> {
            var response = this.$http({
                method: "POST",
                url: "AddNewLeague",
                data: { leagueName: leagueName }
            }).success(data => {
                if (typeof data.ExceptionMessage != "undefined") {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                } else {
                    response.message = `Her er din kode ${data}`;
                    response.isError = false;
                }
            });

            return response;
        }
    }
}