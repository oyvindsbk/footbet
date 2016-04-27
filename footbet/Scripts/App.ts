/// <reference path="../typings/angularjs/angular.d.ts" />

module MainApp {
    'use strict';
    angular
        .module('footballCompApp', ['ngResource'])
        .config([])
        .service('betBaseController', Services.BetBaseController)
        .service('betService', Services.BetService)
        .service('userBetService', Services.UserBetService)
        .service('resultPageService', Services.ResultPageService)
        .service('leaderboardService', Services.LeaderboardService)
        .service('todaysGamesService', Services.TodaysGamesService)
        .service('leagueService', Services.LeagueService);
} 