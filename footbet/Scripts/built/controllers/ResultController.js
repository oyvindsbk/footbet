/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var ResultController = (function () {
        function ResultController($scope, betBaseController, betService) {
            var _this = this;
            this.$scope = $scope;
            this.betBaseController = betBaseController;
            this.betService = betService;
            this.betBaseController.isRequired = false;
            this.betBaseController.loadModel("");
            $scope.$on('modelLoaded', function () {
                _this.userBetControllerInit();
            });
        }
        ResultController.prototype.saveResultBets = function () {
            var _this = this;
            this.betService.saveBetResult(this.betBaseController.groups, this.betBaseController.playoffGames).then(function (response) {
                _this.message = response;
            });
        };
        ResultController.prototype.initializeGroupsAndPlayoffGames = function () {
            var _this = this;
            angular.forEach(this.betBaseController.groups, function (group) {
                _this.betBaseController.setWinnerAndRunnerUpInGroup(group);
            });
        };
        ResultController.prototype.userBetControllerInit = function () {
            this.initializeGroupsAndPlayoffGames();
        };
        ResultController.$inject = [
            "$scope",
            "betBaseController",
            "betService"
        ];
        return ResultController;
    }());
    Controllers.ResultController = ResultController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("ResultController", Controllers.ResultController);
//# sourceMappingURL=ResultController.js.map