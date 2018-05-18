/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var ResultPageController = (function () {
        function ResultPageController($scope, $rootScope, betBaseController, resultPageService) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.betBaseController = betBaseController;
            this.resultPageService = resultPageService;
            $scope.$on('modelLoaded', function () {
                _this.resultPageControllerInit();
            });
            this.loadResult();
        }
        ResultPageController.prototype.loadResult = function () {
            var _this = this;
            this.resultPageService.loadResult().then(function (betViewModel) {
                _this.betBaseController.groups = betViewModel.groups;
                _this.betBaseController.initializeGroupsForBet();
                _this.betBaseController.initializePlayoffGamesForBet(betViewModel.playoffGames);
                _this.$rootScope.$broadcast('modelLoaded', true);
            });
        };
        ResultPageController.prototype.initializeGroupsAndPlayoffGames = function () {
            var _this = this;
            angular.forEach(this.betBaseController.groups, function (group) {
                _this.betBaseController.setWinnerAndRunnerUpInGroup(group);
                //TODO: recursivly -true false?
                _this.betBaseController.setPlayoffGameTeams(group, false);
            });
        };
        ResultPageController.prototype.resultPageControllerInit = function () {
            this.initializeGroupsAndPlayoffGames();
        };
        ResultPageController.$inject = [
            "$scope",
            "$http",
            "$rootScope",
            "betBaseController"
        ];
        return ResultPageController;
    }());
    Controllers.ResultPageController = ResultPageController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("ResultPageController", Controllers.ResultPageController);
//# sourceMappingURL=ResultPageController.js.map