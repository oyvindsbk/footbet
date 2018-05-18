/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var BetController = (function () {
        function BetController($scope, $window, betBaseController, betService) {
            var _this = this;
            this.$scope = $scope;
            this.$window = $window;
            this.betBaseController = betBaseController;
            this.betService = betService;
            this.numberOfIncompleteGames = 0;
            //TODO: add user name
            this.betBaseController.loadModel("");
            //TODO: check where to put this
            this.$scope.$on('modelLoaded', function () {
                _this.initializeGroupsAndPlayoffGames();
                _this.setLabelForUserBetComplete();
            });
        }
        BetController.prototype.initializeGroupsAndPlayoffGames = function () {
            var _this = this;
            angular.forEach(this.betBaseController.groups, function (group) {
                _this.betBaseController.setWinnerAndRunnerUpInGroup(group);
            });
        };
        BetController.prototype.setLabelForUserBetComplete = function () {
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames > 0 && this.numberOfIncompleteGames < 64) {
                this.userBetIncompleteMessage = "(Ditt spill er ikke komplett!)";
            }
            else {
                this.userBetIncompleteMessage = "";
            }
        };
        BetController.prototype.save = function () {
            var _this = this;
            this.betBaseController.modelChanged = false;
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames === 64) {
                this.betBaseController.errorMessage = "Fyll inn resultater!";
                return;
            }
            this.betService.saveBet(this.betBaseController.groups, this.betBaseController.playoffGames).then(function (response) {
                _this.betBaseController.clearMessages();
                _this.setLabelForUserBetComplete();
                if (response.ExceptionMessage != null) {
                    _this.betBaseController.modelChanged = true;
                    _this.betBaseController.errorMessage = response.ExceptionMessage;
                }
                else {
                    if (_this.numberOfIncompleteGames === 0) {
                        _this.betBaseController.successMessage = response;
                    }
                    else {
                        _this.betBaseController.errorMessage = "Ditt spill er lagret, men du mangler noen resultater. Husk å fyll inn disse før VM starter!";
                    }
                }
            });
        };
        ;
        BetController.$inject = [
            "$scope",
            "$window",
            "betBaseController",
            "betService"
        ];
        return BetController;
    }());
    Controllers.BetController = BetController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("BetController", Controllers.BetController);
//# sourceMappingURL=BetController.js.map