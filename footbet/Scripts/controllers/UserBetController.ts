module Controllers {
    "use strict";

    export class UserBetController {
        users: Services.IUser[];
        selectedUserName: string;
        showUserBet: boolean;
        showSearch: boolean = true;
        eventHasStarted: boolean = false;
        static $inject = [
            "$scope",
            "$location",
            "betBaseController",
            "toaster",
            "userBetService"
        ];

        constructor(private $scope: ng.IScope,
            private $location: ng.ILocationService,
            private betBaseController: Services.BetBaseController,
            private toaster,
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
            if (userNameByLocation) {
                this.showSearch = false;
                this.selectedUserName = userNameByLocation;
                this.betBaseController.loadModel(userNameByLocation);
                this.showUserBet = true;

            } else {
                this.userBetService.getUsers().then((users) => {
                    this.users = users;
                });
            }
        }

        private searchUserBet (searchText) {
            this.showUserBet = false;

            angular.forEach(this.users, user => {
                if (user.userName === searchText) {
                    this.betBaseController.loadModel(user.userName);
                    this.showUserBet = true;
                }
            });

            if (!this.showUserBet) {
                this.toaster.pop('error', "Feil", "Fant ikke bruker, vennligst søk med fullstendig brukernavn");
            }
        }

        private initializeGroupsAndPlayoffGames () {
            angular.forEach(this.betBaseController.groups, (group) => {
                this.betBaseController.setWinnerAndRunnerUpInGroup(group);
                this.betBaseController.setPlayoffGameTeams(group, true);
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