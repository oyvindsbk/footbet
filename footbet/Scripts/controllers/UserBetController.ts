/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class UserBetController {
        errorMessage: string;
        users: Services.IUser[];
        selectedUserName: string;
        showUserBet: boolean;
        showSearch: boolean = true;
        static $inject = [
            "$scope",
            "$location",
            "betBaseController"
        ];

        constructor(private $scope: ng.IScope,
            private $location: ng.ILocationService,
            private betBaseController: Services.BetBaseController,
            private userBetService: Services.UserBetService) {

            betBaseController.isRequired = false;
            this.loadByLocation();
            $scope.$on('modelLoaded', ()=> {
                this.userBetControllerInit();
            });

        }


        private loadByLocation () {
            var url = this.$location.absUrl();
            var userNameByLocation = url.split("username=")[1];
            if (userNameByLocation != null) {
                this.showSearch = false;
                this.selectedUserName = userNameByLocation;
                this.betBaseController.loadModel(userNameByLocation);
                this.showUserBet = true;

            } else {
                this.userBetService.getUsers();
            }
        }

        private searchUserBet () {
            this.showUserBet = false;

            angular.forEach(this.users, user => {
                if (user.userName === this.selectedUserName) {
                    this.betBaseController.loadModel(user.userName);
                    this.errorMessage = "";
                    this.showUserBet = true;
                }
            });

            if (!this.showUserBet) {
                this.errorMessage = "Fant ikke bruker, vennligst søk med fullstendig brukernavn";
            }
        }

        private initializeGroupsAndPlayoffGames () {
            angular.forEach(this.betBaseController.groups, (group) => {
                this.betBaseController.setWinnerAndRunnerUpInGroup(group);
            });
        }

        private userBetControllerInit () {
            this.initializeGroupsAndPlayoffGames();
        }

    }
}
angular
    .module("footballCompApp")
    .controller("UserBetController", Controllers.UserBetController);