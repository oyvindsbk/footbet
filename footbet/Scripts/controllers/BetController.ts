module Controllers {
    "use strict";

    export class BetController {

        private numberOfIncompleteGames = 0;
        public currentGameType = 2;
        private userBetIncompleteMessage: string;
        static $inject = [
            "$scope",
            "$window",
            "toaster",
            "betBaseController",
            "betService"
        ];
   
        constructor(
            private $scope,
            private $window: ng.IWindowService,
            private toaster,
            private betBaseController: Services.BetBaseController,
            private betService: Services.BetService) {

            this.betBaseController.loadModel("");

            this.$scope.$on('modelLoaded', () => {        
                this.initializeGroupsAndPlayoffGames();
                this.setLabelForUserBetComplete();
            });
        }

        private initializeGroupsAndPlayoffGames() {
            angular.forEach(this.betBaseController.groups, group => {
                this.betBaseController.setWinnerAndRunnerUpInGroup(group);
                this.betBaseController.setPlayoffGameTeams(group, true);
            });
        }

        private setLabelForUserBetComplete() {
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames > 0 && this.numberOfIncompleteGames < 65) {
                this.userBetIncompleteMessage = "(Ditt spill er ikke komplett!)";
            } else {
                this.userBetIncompleteMessage = "";
            }
        }
        public add() {
            this.currentGameType++;
        }
        private save() {
            this.betBaseController.modelChanged = false;
            this.betBaseController.isLoading = true;
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames === 65) {
                this.toaster.pop('error', "Feil", "Fyll inn resultater");
                return;
            }
            this.betService.saveBet(this.betBaseController.groups, this.betBaseController.playoffGames, this.betBaseController.selectedTopScorer).then((response) => {
                this.betBaseController.isLoading = false;
                this.setLabelForUserBetComplete();

                if (response.ExceptionMessage != null) {
                    this.betBaseController.modelChanged = true;
                    this.toaster.pop('error', "Feil", response.ExceptionMessage);
                } else {
                    if (this.numberOfIncompleteGames === 0) {
                        this.toaster.pop('success', "Lagret", "Ditt spill er lagret!");
                    } else {
                        this.toaster.pop('warning', "Lagret", "Ditt spill er lagret, men du mangler noen resultater. Husk å fyll inn disse før VM starter!");
                    }
                }
            });
        };
    }

}

angular
    .module("footballCompApp")
    .controller("BetController", Controllers.BetController);