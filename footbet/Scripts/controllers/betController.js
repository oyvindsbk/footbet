/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
var Controllers;
(function (Controllers) {
    "use strict";
    var BetController = (function () {
        function BetController($scope, $resource, $http, $location) {
            this.$scope = $scope;
            this.$resource = $resource;
            this.$http = $http;
            this.$location = $location;
            this.claimNumber = $location.search().claimnumber;
            this.loadHistoricPayments();
        }
        BetController.$inject = [
            "$scope",
            "$resource",
            "$http",
            "$location",
            "$translate",
            "treeGrid"
        ];
        return BetController;
    })();
    Controllers.BetController = BetController;
})(Controllers || (Controllers = {}));
