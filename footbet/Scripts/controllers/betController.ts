/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class BetController {

        private numberOfIncompleteGames = 0;
        private userBetIncompleteMessage: string;
        static $inject = [
            "$scope",
            "$window",
            "betBaseController",
            "betService"
        ];

        constructor(
            private $scope,
            private $window: ng.IWindowService,
            private betBaseController: Services.BetBaseController,
            private betService: Services.BetService) {
            //TODO: add user name
            this.betBaseController.loadModel("");

            //TODO: check where to put this
            this.$scope.$on('modelLoaded',() =>  {
                this.initializeGroupsAndPlayoffGames();
                this.setLabelForUserBetComplete();
            });

        }

        private initializeGroupsAndPlayoffGames() {
            angular.forEach(this.betBaseController.groups, group => {
                this.betBaseController.setWinnerAndRunnerUpInGroup(group);
            });
        }

        private setLabelForUserBetComplete() {
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames > 0 && this.numberOfIncompleteGames < 64) {
                this.userBetIncompleteMessage = "(Ditt spill er ikke komplett!)";
            } else {
                this.userBetIncompleteMessage = "";
            }
        }

        private save() {
            this.betBaseController.modelChanged = false;
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames === 64) {
                this.betBaseController.errorMessage = "Fyll inn resultater!";
                return;
            }
            this.betService.saveBet(this.betBaseController.groups, this.betBaseController.playoffGames).then((response) => {
                this.betBaseController.clearMessages();
                this.setLabelForUserBetComplete();

                if (response.ExceptionMessage != null) {
                    this.betBaseController.modelChanged = true;
                    this.betBaseController.errorMessage = response.ExceptionMessage;
                } else {
                    if (this.numberOfIncompleteGames === 0) {
                        this.betBaseController.successMessage = response;
                    } else {
                        this.betBaseController.errorMessage = "Ditt spill er lagret, men du mangler noen resultater. Husk å fyll inn disse før VM starter!";
                    }
                }
            });
        };
    }

}

angular
    .module("footballCompApp")
    .controller("BetController", Controllers.BetController);