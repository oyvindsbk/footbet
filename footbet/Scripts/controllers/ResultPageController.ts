/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class ResultPageController {
        message: string;

        static $inject = [
            "$scope",
            "$http",
            "$rootScope",
            "betBaseController"
        ];

        constructor(private $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private betBaseController: Services.BetBaseController,
            private resultPageService: Services.ResultPageService) {
            $scope.$on('modelLoaded', ()=> {
                this.resultPageControllerInit();
            });
            this.loadResult();

        }
        private loadResult() {
            this.resultPageService.loadResult().then((betViewModel) => {
                this.betBaseController.groups = betViewModel.groups;
                this.betBaseController.initializeGroupsForBet();
                this.betBaseController.initializePlayoffGamesForBet(betViewModel.playoffGames);
                this.$rootScope.$broadcast('modelLoaded', true);
            });
        }

        private initializeGroupsAndPlayoffGames() {
            angular.forEach(this.betBaseController.groups, (group)=> {
                this.betBaseController.setWinnerAndRunnerUpInGroup(group);
                //TODO: recursivly -true false?
                this.betBaseController.setPlayoffGameTeams(group, false);
            });
        }

        private resultPageControllerInit () {
            this.initializeGroupsAndPlayoffGames();
        }
    }
}