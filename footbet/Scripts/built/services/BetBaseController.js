var Services;
(function (Services) {
    var BetBaseController = (function () {
        function BetBaseController($resource, $rootScope, orderByFilter) {
            this.$resource = $resource;
            this.$rootScope = $rootScope;
            this.orderByFilter = orderByFilter;
            this.isRequired = true;
            this.predicate = ["-points", "-sumGoals", "-goalsScored"];
            this.modelChanged = false;
        }
        BetBaseController.prototype.loadModel = function (userName) {
            var _this = this;
            this.$resource("../Bet/GetBasisForBet/" + userName).get(function (betViewModel) {
                _this.groups = betViewModel.groups;
                _this.initializeGroupsForBet();
                _this.initializePlayoffGamesForBet(betViewModel.playoffGames);
                _this.$rootScope.$broadcast("modelLoaded", true);
            });
            // onFail: this.errorMessage = status;
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
                if (playoffGame.id === group.winnerGameCode) {
                    playoffGame.homeTeam = group.winner;
                }
                if (playoffGame.id === group.runnerUpGameCode) {
                    playoffGame.awayTeam = group.runnerUp;
                }
                if (setPlayoffGamesRecursively)
                    _this.playoffGameScoreChanged(playoffGame);
            });
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
            if (playoffGame.homeGoals || playoffGame.awayGoals)
                return;
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
            var numberOfIncompleteGames = 0;
            angular.forEach(this.groups, function (group) {
                angular.forEach(group.games, function (game) {
                    if (isNaN(game.homeGoals) || isNaN(game.awayGoals)) {
                        numberOfIncompleteGames++;
                    }
                });
            });
            angular.forEach(this.playoffGames, function (playoffGame) {
                if (isNaN(playoffGame.homeGoals) || isNaN(playoffGame.awayGoals)) {
                    numberOfIncompleteGames++;
                }
            });
            return numberOfIncompleteGames;
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