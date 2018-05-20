module Services {
    "use strict";

    export class LeagueService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) {}

        getLeagues(): ng.IPromise<ILeague[]> {
            var promise = this.$http({
                method: "GET",
                url: "GetLeaguesForUser"
            }).then(response => response.data);
            return promise;
        }

        joinLeague(leagueCode: string): ng.IPromise<IResponse> {
            var promise = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeagueByGuid",
                data: { guid: leagueCode }
            }).then(result => {
                var data = result.data;
                var response = <IResponse>{};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                return response;
            });
            return promise;
        }

        addCurrentUserToLeague(leagueName: string): ng.IPromise<IResponse> {
            var result = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeague",
                data: { leagueName: leagueName }
            }).then(result => {
                var data = result.data;
                var response = <IResponse>{};

                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                } else {
                    response.message = `KODE FOR Å BLI MED I LIGA: ${data}`;
                    response.isError = false;
                }
                return response;
            });
            return result;
        }

        addNewLeague(leagueName: string): ng.IPromise<IResponse> {
            var promise = this.$http({
                method: "POST",
                url: "AddNewLeague",
                data: { leagueName: leagueName }
            }).then(result => {
                var data = result.data;
                var response = <IResponse>{};

                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                } else {
                    response.message = `KODE FOR Å BLI MED I LIGA: ${data}`;
                    response.isError = false;
                }
                return response;
            });

            return promise;
        }
    }
}