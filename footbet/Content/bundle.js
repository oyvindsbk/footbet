var Services;
(function (Services) {
    var BetBaseController = /** @class */ (function () {
        function BetBaseController($resource, $rootScope, orderByFilter) {
            this.$resource = $resource;
            this.$rootScope = $rootScope;
            this.orderByFilter = orderByFilter;
            this.isRequired = true;
            this.predicate = ["-points", "-sumGoals", "-goalsScored"];
            this.playoffTypes = { 2: '8-delsfinaler', 3: 'Kvartfinaler', 4: 'Semifinaler', 5: 'Bronsefinale', 6: 'Finale' };
            this.modelChanged = false;
        }
        BetBaseController.prototype.loadModel = function (userName) {
            var _this = this;
            this.$resource("../Bet/GetBasisForBet/" + userName).get(function (betViewModel) {
                _this.groups = betViewModel.groups;
                _this.players = betViewModel.players;
                _this.selectedTopScorer = betViewModel.selectedTopScorer;
                _this.initializeGroupsForBet();
                _this.initializePlayoffGamesForBet(betViewModel.playoffGames);
                _this.$rootScope.$broadcast("modelLoaded", true);
            });
        };
        BetBaseController.prototype.scoreChanged = function (group, game) {
            if (isNaN(game.homeGoals) || isNaN(game.awayGoals))
                return;
            this.updateTeamsInGroup(group);
            this.setWinnerAndRunnerUpInGroup(group);
            this.setPlayoffGameTeams(group, true);
            this.modelChanged = true;
            this.clearMessages();
        };
        BetBaseController.prototype.setPlayoffGameTeams = function (group, setPlayoffGamesRecursively) {
            var _this = this;
            var shouldSetPlayoffGameTeams = true;
            angular.forEach(group.games, function (game) {
                if (game.homeGoals == null || game.awayGoals == null)
                    shouldSetPlayoffGameTeams = false;
            });
            if (!shouldSetPlayoffGameTeams)
                return;
            angular.forEach(this.playoffGames, function (playoffGame) {
                if (playoffGame.id === group.winnerGameId) {
                    playoffGame.homeTeam = group.winner;
                }
                if (playoffGame.id === group.runnerUpGameId) {
                    playoffGame.awayTeam = group.runnerUp;
                }
                if (setPlayoffGamesRecursively)
                    _this.playoffGameScoreChanged(playoffGame);
            });
        };
        BetBaseController.prototype.playoffAwayTeamSelected = function (playoffGame) {
            playoffGame.homeGoals = 0;
            playoffGame.awayGoals = 1;
            this.playoffGameScoreChanged(playoffGame);
        };
        BetBaseController.prototype.playoffHomeTeamSelected = function (playoffGame) {
            playoffGame.homeGoals = 1;
            playoffGame.awayGoals = 0;
            this.playoffGameScoreChanged(playoffGame);
        };
        BetBaseController.prototype.displayPlayoffHeader = function (gameType) {
            var playoffType = this.playoffTypes[gameType];
            if (!this.displayedPlayoffTypes.includes(gameType)) {
                this.displayedPlayoffTypes.push(gameType);
                return playoffType;
            }
            return null;
        };
        BetBaseController.prototype.updateTeamsInGroup = function (group) {
            var _this = this;
            angular.forEach(group.teams, function (team) {
                team = _this.clearTeamValues(team);
                angular.forEach(group.games, function (currentGame) {
                    var pointsForGame;
                    if (currentGame.homeGoals != null && currentGame.awayGoals != null) {
                        if (currentGame.homeTeam.id === team.id) {
                            team.goalsScored += currentGame.homeGoals;
                            team.goalsConceded += currentGame.awayGoals;
                            pointsForGame = _this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
                            team.points += _this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
                            if (pointsForGame === 3)
                                team.gamesWonAgainstTeams.push(currentGame.awayTeam);
                        }
                        if (currentGame.awayTeam.id === team.id) {
                            team.goalsScored += currentGame.awayGoals;
                            team.goalsConceded += currentGame.homeGoals;
                            pointsForGame = _this.setPointsForGame(currentGame.awayGoals, currentGame.homeGoals);
                            team.points += pointsForGame;
                            if (pointsForGame === 3)
                                team.gamesWonAgainstTeams.push(currentGame.homeTeam);
                        }
                    }
                });
                team.sumGoals = team.goalsScored - team.goalsConceded;
            });
        };
        BetBaseController.prototype.clearTeamValues = function (team) {
            team.goalsScored = 0;
            team.goalsConceded = 0;
            team.points = 0;
            team.sumGoals = 0;
            team.gamesWonAgainstTeams = [];
            return team;
        };
        BetBaseController.prototype.setPointsForGame = function (goalsScored, goalsConceded) {
            if (goalsScored > goalsConceded)
                return 3;
            if (goalsScored < goalsConceded)
                return 0;
            if (goalsScored === goalsConceded)
                return 1;
            return 0;
        };
        BetBaseController.prototype.initializeGroupsForBet = function () {
            var _this = this;
            angular.forEach(this.groups, function (group) {
                angular.forEach(group.teams, function (team) {
                    team.goalsConceded = 0;
                    team.goalsScored = 0;
                    team.points = 0;
                    team.sumGoals = 0;
                });
                _this.updateTeamsInGroup(group);
                angular.forEach(group.games, function (game) {
                    angular.forEach(game.teamGames, function (teamGame) {
                        if (teamGame.isHomeTeam) {
                            game.homeTeam = teamGame.team;
                        }
                        else
                            game.awayTeam = teamGame.team;
                    });
                });
            });
        };
        BetBaseController.prototype.initializePlayoffGamesForBet = function (playoffGames) {
            angular.forEach(playoffGames, function (playoffGame) {
                playoffGame.playoffGameDetails = playoffGame.playoffGameDetails[0];
            });
            this.playoffGames = playoffGames;
        };
        BetBaseController.prototype.setWinnerAndRunnerUpInGroup = function (group) {
            group.teams = this.orderTeamsBestFirst(group.teams);
            group.winner = group.teams[0];
            group.runnerUp = group.teams[1];
            return group;
        };
        BetBaseController.prototype.orderTeamsBestFirst = function (teams) {
            var sortedTeams = this.orderByFilter(teams, this.predicate, false);
            if (this.teamsAreEqualByPredicate(sortedTeams, 0, 1)) {
                this.swapTeamsByGamesWonAgainstEachother(sortedTeams, 0, 1);
                if (this.teamsAreEqualByPredicate(sortedTeams, 1, 2)) {
                    this.swapTeamsByGamesWonAgainstEachother(sortedTeams, 1, 2);
                    if (this.teamsAreEqualByPredicate(sortedTeams, 2, 3)) {
                        this.swapTeamsByGamesWonAgainstEachother(sortedTeams, 2, 3);
                        return sortedTeams;
                    }
                    return sortedTeams;
                }
                return sortedTeams;
            }
            return sortedTeams;
        };
        BetBaseController.prototype.clearMessages = function () {
            this.errorMessage = "";
            this.successMessage = "";
        };
        BetBaseController.prototype.playoffGameScoreChanged = function (playoffGame) {
            var isHomeTeam;
            var proceedingTeam;
            var nextGameId;
            if (playoffGame.playoffGameDetails.nextPlayoffGame != null) {
                proceedingTeam = this.getWinnerOfGame(playoffGame);
                if (proceedingTeam == null)
                    return;
                isHomeTeam = playoffGame.playoffGameDetails.isHomeTeamNextGame;
                nextGameId = playoffGame.playoffGameDetails.nextPlayoffGame;
                this.setNextPlayoffGame(nextGameId, proceedingTeam, isHomeTeam);
            }
            if (playoffGame.playoffGameDetails.nextPlayoffGameRunnerUp != null) {
                proceedingTeam = this.getRunnerUpOfGame(playoffGame);
                if (proceedingTeam == null)
                    return;
                isHomeTeam = playoffGame.playoffGameDetails.isHomeTeamInRunnerUpGame;
                nextGameId = playoffGame.playoffGameDetails.nextPlayoffGameRunnerUp;
                this.setNextPlayoffGame(nextGameId, proceedingTeam, isHomeTeam);
            }
            this.modelChanged = true;
            this.clearMessages();
        };
        BetBaseController.prototype.setNextPlayoffGame = function (nextGameId, proceedingTeam, isHomeTeam) {
            var stopLoop = false;
            angular.forEach(this.playoffGames, function (pg) {
                if (stopLoop)
                    return;
                if (pg.id === nextGameId) {
                    if (isHomeTeam) {
                        pg.homeTeam = proceedingTeam;
                    }
                    else {
                        pg.awayTeam = proceedingTeam;
                    }
                    stopLoop = true;
                }
            });
        };
        BetBaseController.prototype.getWinnerOfGame = function (playoffGame) {
            if (playoffGame.homeGoals > playoffGame.awayGoals) {
                return playoffGame.homeTeam;
            }
            else if (playoffGame.awayGoals > playoffGame.homeGoals) {
                return playoffGame.awayTeam;
            }
            return null;
        };
        BetBaseController.prototype.getRunnerUpOfGame = function (playoffGame) {
            if (playoffGame.homeGoals < playoffGame.awayGoals) {
                return playoffGame.homeTeam;
            }
            return playoffGame.awayTeam;
        };
        BetBaseController.prototype.setTeamScore = function (team, opposingTeam, currentGame) {
            team.goalsScored += currentGame.homeGoals;
            team.goalsConceded += currentGame.awayGoals;
            var pointsForGame = this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
            team.points += this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
            if (pointsForGame === 3)
                team.gamesWonAgainstTeams.push(currentGame.awayTeam);
        };
        BetBaseController.prototype.validateIfUserBetIsComplete = function () {
            var _this = this;
            var numberOfIncompleteGames = 0;
            angular.forEach(this.groups, function (group) {
                angular.forEach(group.games, function (game) {
                    if (_this.isGameIncomplete(game)) {
                        numberOfIncompleteGames++;
                    }
                });
            });
            angular.forEach(this.playoffGames, function (playoffGame) {
                if (_this.isGameIncomplete(playoffGame)) {
                    numberOfIncompleteGames++;
                }
            });
            if (!this.selectedTopScorer)
                numberOfIncompleteGames++;
            return numberOfIncompleteGames;
        };
        BetBaseController.prototype.isGameIncomplete = function (game) {
            return (game.homeGoals !== 0 && !game.homeGoals) || (game.awayGoals !== 0 && !game.awayGoals);
        };
        BetBaseController.prototype.teamsAreEqualByPredicate = function (sortedTeams, indexTeamOne, indexTeamTwo) {
            return sortedTeams[indexTeamOne].points === sortedTeams[indexTeamTwo].points &&
                sortedTeams[indexTeamOne].sumGoals === sortedTeams[indexTeamTwo].sumGoals &&
                sortedTeams[indexTeamOne].goalsScored === sortedTeams[indexTeamTwo].goalsScored;
        };
        BetBaseController.prototype.swapTeamsByGamesWonAgainstEachother = function (sortedTeams, indexTeamOne, indexTeamTwo) {
            if (this.isInArray(sortedTeams[indexTeamOne].id, sortedTeams[indexTeamTwo].gamesWonAgainstTeams)) {
                var firstTeam = sortedTeams[indexTeamOne];
                sortedTeams[indexTeamOne] = sortedTeams[indexTeamTwo];
                sortedTeams[indexTeamTwo] = firstTeam;
            }
        };
        BetBaseController.prototype.isInArray = function (value, array) {
            return array.indexOf(value) > -1;
        };
        BetBaseController.$inject = [
            "$resource",
            "$rootScope",
            "orderByFilter"
        ];
        return BetBaseController;
    }());
    Services.BetBaseController = BetBaseController;
})(Services || (Services = {}));
//# sourceMappingURL=BetBaseController.js.map
var Services;
(function (Services) {
    "use strict";
    var LeaderboardService = /** @class */ (function () {
        function LeaderboardService($http) {
            this.$http = $http;
        }
        LeaderboardService.prototype.getLeaderboard = function () {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetOverallLeaderboardBySportsEventId",
            }).then(function (response) { return response.data; });
            return leaderboard;
        };
        LeaderboardService.prototype.getLeaderboardForLeague = function (leagueId) {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetLeaderboardByLeagueId",
                data: { leagueId: leagueId }
            }).then(function (response) { return response.data; });
            return leaderboard;
        };
        ;
        LeaderboardService.$inject = [
            "$http"
        ];
        return LeaderboardService;
    }());
    Services.LeaderboardService = LeaderboardService;
})(Services || (Services = {}));
//# sourceMappingURL=LeaderboardService.js.map
var Services;
(function (Services) {
    "use strict";
    var LeagueService = /** @class */ (function () {
        function LeagueService($http) {
            this.$http = $http;
        }
        LeagueService.prototype.getLeagues = function () {
            var promise = this.$http({
                method: "GET",
                url: "GetLeaguesForUser"
            }).then(function (response) { return response.data; });
            return promise;
        };
        LeagueService.prototype.joinLeague = function (leagueCode) {
            var promise = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeagueByGuid",
                data: { guid: leagueCode }
            }).then(function (result) {
                var data = result.data;
                var response = {};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                return response;
            });
            return promise;
        };
        LeagueService.prototype.addCurrentUserToLeague = function (leagueName) {
            var result = this.$http({
                method: "POST",
                url: "AddCurrentUserToLeague",
                data: { leagueName: leagueName }
            }).then(function (result) {
                var data = result.data;
                var response = {};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                else {
                    response.message = "KODE FOR \u00C5 BLI MED I LIGA: " + data;
                    response.isError = false;
                }
                return response;
            });
            return result;
        };
        LeagueService.prototype.addNewLeague = function (leagueName) {
            var promise = this.$http({
                method: "POST",
                url: "AddNewLeague",
                data: { leagueName: leagueName }
            }).then(function (result) {
                var data = result.data;
                var response = {};
                if (data.ExceptionMessage) {
                    response.message = data.ExceptionMessage;
                    response.isError = true;
                }
                else {
                    response.message = "KODE FOR \u00C5 BLI MED I LIGA: " + data;
                    response.isError = false;
                }
                return response;
            });
            return promise;
        };
        LeagueService.$inject = [
            "$http"
        ];
        return LeagueService;
    }());
    Services.LeagueService = LeagueService;
})(Services || (Services = {}));
//# sourceMappingURL=LeagueService.js.map
var Services;
(function (Services) {
    "use strict";
    var ResultPageService = /** @class */ (function () {
        function ResultPageService($http) {
            this.$http = $http;
        }
        ResultPageService.prototype.loadResult = function () {
            var response = this.$http({
                url: "../ResultPage/GetResults",
                method: "POST"
            }).then(function (response) {
                return response.data;
            })
                .catch(function (error) { return error.status; });
            return response;
        };
        ResultPageService.prototype.getLeaderboardForLeague = function (leagueId) {
            var leaderboard = this.$http({
                method: 'POST',
                url: "../Leaderboard/GetLeaderboardByLeagueId",
                data: { leagueId: leagueId }
            }).then(function (response) { return response.data; });
            return leaderboard;
        };
        ;
        ResultPageService.$inject = [
            "$http"
        ];
        return ResultPageService;
    }());
    Services.ResultPageService = ResultPageService;
})(Services || (Services = {}));
//# sourceMappingURL=ResultPageService.js.map
var Services;
(function (Services) {
    "use strict";
    var BetService = /** @class */ (function () {
        function BetService($http) {
            this.$http = $http;
        }
        BetService.prototype.saveBet = function (groups, playoffGames, selectedTopScorer) {
            var groupGamesResultJson = this.extractGroupResultFromGroups(groups);
            var playoffGamesResultJson = this.extractPlayoffGamesResultFromPlayoffGames(playoffGames);
            var selectedTopScorerJson = angular.toJson(selectedTopScorer);
            var promise = this.$http({
                method: 'POST',
                url: "../Bet/SavePersonBet",
                data: {
                    groupGamesResult: groupGamesResultJson,
                    playoffGamesResult: playoffGamesResultJson,
                    selectedTopScorer: selectedTopScorerJson
                }
            }).then(function (response) { return response.data; });
            return promise;
        };
        BetService.prototype.saveBetResult = function (groups, playoffGames) {
            var groupGamesResultJson = this.extractGroupResultFromGroups(groups);
            var playoffGamesResultJson = this.extractPlayoffGamesResultFromPlayoffGames(playoffGames);
            var promise = this.$http({
                method: 'POST',
                url: "../Result/SaveResultBets",
                data: { groupGamesResult: groupGamesResultJson, playoffGamesResult: playoffGamesResultJson },
            }).then(function (response) { return response.data; });
            return promise;
        };
        BetService.prototype.extractGroupResultFromGroups = function (groups) {
            var groupResults = [];
            angular.forEach(groups, function (group) {
                angular.forEach(group.games, function (game) {
                    if (game.homeGoals != null || game.awayGoals != null)
                        groupResults.push(game);
                });
            });
            return angular.toJson(groupResults);
        };
        BetService.prototype.extractPlayoffGamesResultFromPlayoffGames = function (playoffGames) {
            var playoffGamesResults = [];
            angular.forEach(playoffGames, function (game) {
                if (game.homeTeam != null && game.awayTeam != null)
                    playoffGamesResults.push(game);
            });
            return angular.toJson(playoffGamesResults);
        };
        BetService.$inject = [
            "$http"
        ];
        return BetService;
    }());
    Services.BetService = BetService;
})(Services || (Services = {}));
//# sourceMappingURL=BetService.js.map
var Services;
(function (Services) {
    "use strict";
    var UserBetService = /** @class */ (function () {
        function UserBetService($http) {
            this.$http = $http;
        }
        UserBetService.prototype.getUsers = function () {
            var promise = this.$http({
                method: "GET",
                url: "../User/GetUsers"
            }).then(function (response) { return response.data; });
            return promise;
        };
        UserBetService.$inject = [
            "$http"
        ];
        return UserBetService;
    }());
    Services.UserBetService = UserBetService;
})(Services || (Services = {}));
//# sourceMappingURL=UserBetService.js.map
var Services;
(function (Services) {
    "use strict";
    var TodaysGamesService = /** @class */ (function () {
        function TodaysGamesService($http) {
            this.$http = $http;
        }
        TodaysGamesService.prototype.getPreviousGames = function (daysFromToday) {
            var todaysGames = this.$http({
                method: 'POST',
                url: "../TodaysGames/GetPreviousGames",
                data: { daysFromToday: daysFromToday }
            }).then(function (response) {
                if (response.ExceptionMessage != null) {
                    return false;
                }
                ;
                return response.data;
            });
            return todaysGames;
        };
        TodaysGamesService.prototype.getNextGames = function (daysFromToday) {
            var todaysGames = this.$http({
                method: 'POST',
                url: "../TodaysGames/GetNextGames",
                data: { daysFromToday: daysFromToday }
            }).then(function (response) {
                if (response.data.ExceptionMessage != null) {
                    return null;
                }
                return response.data;
            });
            return todaysGames;
        };
        ;
        TodaysGamesService.$inject = [
            "$http"
        ];
        return TodaysGamesService;
    }());
    Services.TodaysGamesService = TodaysGamesService;
})(Services || (Services = {}));
//# sourceMappingURL=TodaysGamesService.js.map
var MainApp;
(function (MainApp) {
    'use strict';
    angular
        .module('footballCompApp', ['ngResource', 'toaster', 'ngAnimate', 'ui.bootstrap'])
        .service('betBaseController', Services.BetBaseController)
        .service('betService', Services.BetService)
        .service('userBetService', Services.UserBetService)
        .service('resultPageService', Services.ResultPageService)
        .service('leaderboardService', Services.LeaderboardService)
        .service('todaysGamesService', Services.TodaysGamesService)
        .service('leagueService', Services.LeagueService);
})(MainApp || (MainApp = {}));
//# sourceMappingURL=app.js.map
var Controllers;
(function (Controllers) {
    "use strict";
    var BetController = /** @class */ (function () {
        function BetController($scope, $window, toaster, betBaseController, betService) {
            var _this = this;
            this.$scope = $scope;
            this.$window = $window;
            this.toaster = toaster;
            this.betBaseController = betBaseController;
            this.betService = betService;
            this.numberOfIncompleteGames = 0;
            this.currentGameType = 2;
            this.betBaseController.loadModel("");
            this.$scope.$on('modelLoaded', function () {
                _this.initializeGroupsAndPlayoffGames();
                _this.setLabelForUserBetComplete();
            });
        }
        BetController.prototype.initializeGroupsAndPlayoffGames = function () {
            var _this = this;
            angular.forEach(this.betBaseController.groups, function (group) {
                _this.betBaseController.setWinnerAndRunnerUpInGroup(group);
                _this.betBaseController.setPlayoffGameTeams(group, true);
            });
        };
        BetController.prototype.setLabelForUserBetComplete = function () {
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames > 0 && this.numberOfIncompleteGames < 65) {
                this.userBetIncompleteMessage = "(Ditt spill er ikke komplett!)";
            }
            else {
                this.userBetIncompleteMessage = "";
            }
        };
        BetController.prototype.add = function () {
            this.currentGameType++;
        };
        BetController.prototype.save = function () {
            var _this = this;
            this.betBaseController.modelChanged = false;
            this.numberOfIncompleteGames = this.betBaseController.validateIfUserBetIsComplete();
            if (this.numberOfIncompleteGames === 65) {
                this.toaster.pop('error', "Feil", "Fyll inn resultater");
                return;
            }
            this.betService.saveBet(this.betBaseController.groups, this.betBaseController.playoffGames, this.betBaseController.selectedTopScorer).then(function (response) {
                _this.betBaseController.clearMessages();
                _this.setLabelForUserBetComplete();
                if (response.ExceptionMessage != null) {
                    _this.betBaseController.modelChanged = true;
                    _this.betBaseController.errorMessage = response.ExceptionMessage;
                }
                else {
                    if (_this.numberOfIncompleteGames === 0) {
                        _this.toaster.pop('success', "Lagret", "Ditt spill er lagret!");
                    }
                    else {
                        _this.toaster.pop('warning', "Lagret", "Ditt spill er lagret, men du mangler noen resultater. Husk å fyll inn disse før VM starter!");
                    }
                }
            });
        };
        ;
        BetController.$inject = [
            "$scope",
            "$window",
            "toaster",
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
var Controllers;
(function (Controllers) {
    "use strict";
    var LeaderboardController = /** @class */ (function () {
        function LeaderboardController($scope, $rootScope, leaderboardService) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.leaderboardService = leaderboardService;
            this.headerText = "";
            this.numberOfIncompleteGames = 0;
            this.$rootScope.$on("showLeagueEvent", function (event, league) {
                _this.getLeaderboardForLeague(league.id);
                _this.headerText = "Stilling for " + league.name;
            });
        }
        LeaderboardController.prototype.getLeaderboard = function () {
            var _this = this;
            this.leaderboardService.getLeaderboard().then(function (leaderboard) {
                _this.leaderboard = leaderboard;
            });
        };
        LeaderboardController.prototype.getLeaderboardForLeague = function (leagueId) {
            var _this = this;
            this.leaderboardService.getLeaderboardForLeague(leagueId).then(function (leaderboard) {
                _this.leaderboard = leaderboard;
            });
        };
        LeaderboardController.$inject = [
            "$scope",
            "$rootScope",
            "leaderboardService"
        ];
        return LeaderboardController;
    }());
    Controllers.LeaderboardController = LeaderboardController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("LeaderboardController", Controllers.LeaderboardController);
//# sourceMappingURL=LeaderboardController.js.map
var Controllers;
(function (Controllers) {
    "use strict";
    var LeagueController = /** @class */ (function () {
        function LeagueController($scope, $rootScope, leagueService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.leagueService = leagueService;
            this.loadLeagues();
        }
        LeagueController.prototype.loadLeagues = function () {
            var _this = this;
            this.leagueService.getLeagues().then(function (leagues) {
                _this.leagues = leagues;
                _this.showLeague(leagues[0]);
            });
        };
        LeagueController.prototype.joinLeague = function () {
            var _this = this;
            this.leagueService.joinLeague(this.leagueCode).then(function (response) {
                if (response.isError) {
                    _this.message = response.message;
                    _this.messageClass = "error";
                }
                else
                    _this.loadLeagues();
            });
        };
        LeagueController.prototype.addCurrentUserToLeague = function () {
            var _this = this;
            this.leagueService.addCurrentUserToLeague(this.leagueName).then(function (response) {
                _this.message = response.message;
                if (response.isError) {
                    _this.messageClass = "error";
                }
                else {
                    _this.messageClass = "success";
                    _this.loadLeagues();
                }
            });
        };
        LeagueController.prototype.addNewLeague = function () {
            var _this = this;
            if (this.leagueName === "") {
                this.message = "Liganavn kan ikke være tomt";
                this.messageClass = "error";
                return;
            }
            this.leagueService.addNewLeague(this.leagueName).then(function (response) {
                if (response.isError) {
                    _this.messageClass = "error";
                }
                else {
                    _this.messageClass = "success";
                    _this.message = response.message;
                    _this.loadLeagues();
                }
            });
        };
        LeagueController.prototype.showLeague = function (league) {
            this.$rootScope.$broadcast("showLeagueEvent", league);
        };
        LeagueController.$inject = [
            "$scope",
            "$rootScope",
            "leagueService"
        ];
        return LeagueController;
    }());
    Controllers.LeagueController = LeagueController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("LeagueController", Controllers.LeagueController);
//# sourceMappingURL=LeagueController.js.map
var Controllers;
(function (Controllers) {
    "use strict";
    var ResultController = /** @class */ (function () {
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
var Controllers;
(function (Controllers) {
    "use strict";
    var TodaysGamesController = /** @class */ (function () {
        function TodaysGamesController($scope, todaysGamesService) {
            this.$scope = $scope;
            this.todaysGamesService = todaysGamesService;
            this.todaysDate = new Date();
            this.daysFromNow = 0;
            this.loadTodaysGames();
        }
        TodaysGamesController.prototype.nextDay = function () {
            if (this.nextButtonDisabled)
                return;
            this.daysFromNow++;
            this.getNextGames();
        };
        TodaysGamesController.prototype.previousDay = function () {
            if (this.previousButtonDisabled)
                return;
            this.daysFromNow--;
            this.getPreviousGames();
        };
        TodaysGamesController.prototype.loadTodaysGames = function () {
            var _this = this;
            this.nextButtonDisabled = true;
            this.previousButtonDisabled = true;
            this.todaysGamesService.getNextGames(this.daysFromNow).then(function (todaysGames) {
                _this.previousButtonDisabled = todaysGames.isFirstDay;
                _this.nextButtonDisabled = _this.isNextButtonDisabled();
                _this.todaysGames = todaysGames.todaysGamesSpecification;
                _this.daysFromNow += todaysGames.numberOfDaysFromToday;
                _this.loaded = true;
                _this.todaysDate = _this.getTodaysDatePlusDays(_this.daysFromNow);
            });
        };
        TodaysGamesController.prototype.getNextGames = function () {
            var _this = this;
            this.nextButtonDisabled = true;
            this.todaysGamesService.getNextGames(this.daysFromNow).then(function (todaysGames) {
                _this.previousButtonDisabled = false;
                _this.todaysGames = todaysGames.todaysGamesSpecification;
                _this.daysFromNow += todaysGames.numberOfDaysFromToday;
                _this.todaysDate = _this.getTodaysDatePlusDays(_this.daysFromNow);
                _this.nextButtonDisabled = _this.isNextButtonDisabled();
            });
        };
        TodaysGamesController.prototype.getPreviousGames = function () {
            var _this = this;
            this.previousButtonDisabled = true;
            this.todaysGamesService.getPreviousGames(this.daysFromNow).then(function (todaysGames) {
                _this.previousButtonDisabled = todaysGames.isFirstDay;
                _this.nextButtonDisabled = false;
                _this.todaysGames = todaysGames.todaysGamesSpecification;
                _this.daysFromNow += todaysGames.numberOfDaysFromToday;
                _this.todaysDate = _this.getTodaysDatePlusDays(_this.daysFromNow);
            });
        };
        ;
        TodaysGamesController.prototype.isNextButtonDisabled = function () {
            var eventEnds = new Date(2018, 6, 15);
            if (this.todaysDate.getTime() >= eventEnds.getTime()) {
                return true;
            }
            return false;
        };
        TodaysGamesController.prototype.isPreviousButtonDisabled = function () {
            var eventStarts = new Date(2018, 5, 14);
            if (this.todaysDate < eventStarts) {
                return true;
            }
            return false;
        };
        TodaysGamesController.prototype.getTodaysDatePlusDays = function (daysToAdd) {
            var date = new Date();
            return date.addDays(daysToAdd);
        };
        TodaysGamesController.$inject = [
            "$scope",
            "todaysGamesService"
        ];
        return TodaysGamesController;
    }());
    Controllers.TodaysGamesController = TodaysGamesController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("TodaysGamesController", Controllers.TodaysGamesController);
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
//# sourceMappingURL=TodaysGamesController.js.map
var Controllers;
(function (Controllers) {
    "use strict";
    var UserBetController = /** @class */ (function () {
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
                _this.betBaseController.setPlayoffGameTeams(group, true);
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
//# sourceMappingURL=UserBetController.js.map
var Controllers;
(function (Controllers) {
    "use strict";
    var ResultPageController = /** @class */ (function () {
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
                _this.betBaseController.setPlayoffGameTeams(group, true);
            });
        };
        ResultPageController.prototype.resultPageControllerInit = function () {
            this.initializeGroupsAndPlayoffGames();
        };
        ResultPageController.$inject = [
            "$scope",
            "$rootScope",
            "betBaseController",
            "resultPageService"
        ];
        return ResultPageController;
    }());
    Controllers.ResultPageController = ResultPageController;
})(Controllers || (Controllers = {}));
angular
    .module("footballCompApp")
    .controller("ResultPageController", Controllers.ResultPageController);
//# sourceMappingURL=ResultPageController.js.map
//# sourceMappingURL=ViewModels.js.map