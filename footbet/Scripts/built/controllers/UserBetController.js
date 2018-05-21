/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var UserBetController = (function () {
        function UserBetController($scope, $location, betBaseController, userBetService) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.betBaseController = betBaseController;
            this.userBetService = userBetService;
            this.showSearch = true;
            betBaseController.isRequired = false;
            this.loadByLocation();
            $scope.$on('modelLoaded', function () {
                _this.userBetControllerInit();
            });
        }
        UserBetController.prototype.loadByLocation = function () {
            var _this = this;
            var url = this.$location.absUrl();
            var userNameByLocation = url.split("username=")[1];
            if (userNameByLocation) {
                this.showSearch = false;
                this.selectedUserName = userNameByLocation;
                this.betBaseController.loadModel(userNameByLocation);
                this.showUserBet = true;
            }
            else {
                this.userBetService.getUsers().then(function (users) {
                    _this.users = users;
                });
            }
        };
        UserBetController.prototype.searchUserBet = function (searchText) {
            var _this = this;
            this.showUserBet = false;
            angular.forEach(this.users, function (user) {
                if (user.userName === searchText) {
                    _this.betBaseController.loadModel(user.userName);
                    _this.errorMessage = "";
                    _this.showUserBet = true;
                }
            });
            if (!this.showUserBet) {
                this.errorMessage = "Fant ikke bruker, vennligst søk med fullstendig brukernavn";
            }
        };
        UserBetController.prototype.initializeGroupsAndPlayoffGames = function () {
            var _this = this;
            angular.forEach(this.betBaseController.groups, function (group) {
                _this.betBaseController.setWinnerAndRunnerUpInGroup(group);
            });
        };
        UserBetController.prototype.userBetControllerInit = function () {
            this.initializeGroupsAndPlayoffGames();
        };
        UserBetController.$inject = [
            "$scope",
            "$location",
            "betBaseController",
            "userBetService"
        ];
        return UserBetController;
    }());
    Controllers.UserBetController = UserBetController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("UserBetController", Controllers.UserBetController);
