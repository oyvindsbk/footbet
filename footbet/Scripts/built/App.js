/// <reference path="../typings/angularjs/angular.d.ts" />
var MainApp;
(function (MainApp) {
    'use strict';
    angular
        .module('footballCompApp', ['ngResource'])
        .service('betBaseController', Services.BetBaseController)
        .service('betService', Services.BetService);
})(MainApp || (MainApp = {}));
//# sourceMappingURL=App.js.map