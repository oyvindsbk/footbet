/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
module Controllers {
    "use strict";

    export class BetController {

        static $inject = [
            "$scope",
            "$resource",
            "$http",
            "$location",
            "$translate",
            "treeGrid"
        ];


        constructor(
            private $scope,
            private $resource,
            private $http: ng.IHttpService,
            private $location: ng.ILocationService) {

            this.claimNumber = $location.search().claimnumber;
            this.loadHistoricPayments();
        }
    }
}