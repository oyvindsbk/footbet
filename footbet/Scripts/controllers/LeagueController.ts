/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class LeagueController {
        messageClass: string;

        leagueName: string;
        leagueCode: string;
        message: string;
        leagues: Services.ILeague[];
        selectedLeague: Services.ILeague;

        static $inject = [
            "$scope",
            "$rootScope",
            "leagueService"
        ];

        constructor(private $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private leagueService: Services.LeagueService) {
            this.loadLeagues();
        }

        private loadLeagues(): void {
            this.leagueService.getLeagues().then((leagues: Services.ILeague[]) => {
                this.leagues = leagues;
                this.selectedLeague = leagues[0];
            });
        }

        private joinLeague() {
            this.leagueService.joinLeague(this.leagueCode).then((response: Services.IResponse) => {
                if (response.isError) {
                    this.message = response.message;
                    this.messageClass = "error";
                } else this.loadLeagues();
            });
        }

        private addCurrentUserToLeague() {
            this.leagueService.addCurrentUserToLeague(this.leagueName).then((response: Services.IResponse) => {
                this.message = response.message;
                if (response.isError) {
                    this.messageClass = "error";
                } else {
                    this.messageClass = "success";
                    this.loadLeagues();
                }
            });
        }

        private addNewLeague() {
            if (this.leagueName === "") {
                this.message = "Liganavn kan ikke være tomt";
                this.messageClass = "error";
                return;
            }

            this.leagueService.addNewLeague(this.leagueName).then((response: Services.IResponse) => {
                this.message = response.message;
                if (response.isError) {
                    this.messageClass = "error";
                } else {
                    this.messageClass = "success";
                    this.loadLeagues();
                }
            });
        }

        private showLeague(league: Services.ILeague) {
            this.$rootScope.$broadcast("showLeagueEvent", league);
        }
    }

}

angular
    .module("footballCompApp")
    .controller("LeagueController", Controllers.LeagueController);