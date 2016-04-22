angular.module('footballCompApp.services', []).
    factory('betService', ['$http', function($http) {
            var betService = {};
            betService.saveBet = function(groups, playoffGames) {
                var groupGamesResultJson = betService.extractGroupResultFromGroups(groups);
                var playoffGamesResultJson = betService.extractPlayoffGamesResultFromPlayoffGames(playoffGames);

                var promise = $http({
                    method: 'POST',
                    url: "../Bet/SavePersonBet",
                    data: { groupGamesResult: groupGamesResultJson, playoffGamesResult: playoffGamesResultJson },
                }).then(function(response) {
                    return response.data;
                });
                return promise;
            };

            betService.saveBetResult = function(groups, playoffGames) {
                var groupGamesResultJson = betService.extractGroupResultFromGroups(groups);
                var playoffGamesResultJson = betService.extractPlayoffGamesResultFromPlayoffGames(playoffGames);

                var promise = $http({
                    method: 'POST',
                    url: "../Result/SaveResultBets",
                    data: { groupGamesResult: groupGamesResultJson, playoffGamesResult: playoffGamesResultJson },
                }).then(function (response) {
                    return response.data;
                });
                return promise;
            };

            betService.extractGroupResultFromGroups = function(groups) {
                var groupResults = [];

                angular.forEach(groups, function(group) {
                    angular.forEach(group.Games, function(game) {
                        if (game.HomeGoals != null || game.AwayGoals != null)
                            groupResults.push(game);
                    });
                });

                return angular.toJson(groupResults);
            };
            betService.extractPlayoffGamesResultFromPlayoffGames = function(playoffGames) {
                var playoffGamesResults = [];

                angular.forEach(playoffGames, function(game) {
                    if (game.HomeTeam != null || game.AwayTeam != null)
                        playoffGamesResults.push(game);
                });

                return angular.toJson(playoffGamesResults);
            };


            return betService;
        }
    ]).
    factory('betBaseController', ['$http', '$rootScope', 'orderByFilter', function($http, $rootScope, orderByFilter) {
            var betBaseController = {};
            betBaseController.isRequired = true;

            betBaseController.groups = [];
            betBaseController.playoffGames = [];
            betBaseController.groupResults = [];
            betBaseController.playoffGamesResults = [];
            betBaseController.predicate = ['-points', '-sumGoals', '-goalsScored'];
            betBaseController.modelChanged = false;
            betBaseController.errorMessage = "";
            betBaseController.successMessage = "";

            betBaseController.loadModel = function(userName) {
                $http({
                    url: "../Bet/GetBasisForBet",
                    method: "POST",
                    data: { userName: userName },
                }).success(function (betViewModel) {
                    betBaseController.groups = betViewModel.Groups;
                    betBaseController.initializeGroupsForBet();
                    betBaseController.initializePlayoffGamesForBet(betViewModel.PlayoffGames);
                    $rootScope.$broadcast('modelLoaded', true);

                }).error(function(data, status) {
                    betBaseController.errorMessage = status;
                });

            };

            betBaseController.scoreChanged = function(group, game) {
                var homeGoals = parseInt(game.HomeGoals, 10);
                var awayGoals = parseInt(game.AwayGoals, 10);

                if (isNaN(homeGoals) || isNaN(awayGoals)) return;

                betBaseController.updateTeamsInGroup(group);


                betBaseController.setWinnerAndRunnerUpInGroup(group);
                betBaseController.setPlayoffGameTeams(group, true);

                betBaseController.modelChanged = true;
                betBaseController.clearMessages();
            };

            betBaseController.setPlayoffGameTeams = function (group, setPlayoffGamesRecursively) {
                var shouldSetPlayoffGameTeams = true;
                angular.forEach(group.Games, function(game) {
                    if (game.HomeGoals == null || game.AwayGoals == null)
                        shouldSetPlayoffGameTeams = false;
                });

                if (!shouldSetPlayoffGameTeams) return;

                angular.forEach(betBaseController.playoffGames, function(playoffGame) {
                    if (playoffGame.Id == group.WinnerGameCode) {
                        playoffGame.HomeTeam = group.Winner;
                    }
                    if (playoffGame.Id == group.RunnerUpGameCode) {
                        playoffGame.AwayTeam = group.RunnerUp;
                    }
                    if(setPlayoffGamesRecursively) betBaseController.playoffGameScoreChanged(playoffGame);
                });
            };
            betBaseController.updateTeamsInGroup = function(group) {
                angular.forEach(group.Teams, function(team) {
                    team = betBaseController.clearTeamValues(team);
                    angular.forEach(group.Games, function(currentGame) {
                        var pointsForGame;
                        if (currentGame.HomeGoals != null && currentGame.AwayGoals != null) {
                            if (currentGame.HomeTeam.Id == team.Id) {
                                team.goalsScored += currentGame.HomeGoals;
                                team.goalsConceded += currentGame.AwayGoals;
                                pointsForGame = betBaseController.setPointsForGame(currentGame.HomeGoals, currentGame.AwayGoals);
                                team.points += betBaseController.setPointsForGame(currentGame.HomeGoals, currentGame.AwayGoals);
                                if (pointsForGame == 3) team.gamesWonAgainstTeams.push(currentGame.AwayTeam.Id);
                            }
                            if (currentGame.AwayTeam.Id == team.Id) {
                                team.goalsScored += currentGame.AwayGoals;
                                team.goalsConceded += currentGame.HomeGoals;
                                pointsForGame = betBaseController.setPointsForGame(currentGame.AwayGoals, currentGame.HomeGoals);
                                team.points += pointsForGame;
                                if (pointsForGame == 3) team.gamesWonAgainstTeams.push(currentGame.HomeTeam.Id);
                            }
                        }
                    });
                    team.sumGoals = team.goalsScored - team.goalsConceded;
                });
            };

            betBaseController.playoffGameScoreChanged = function(playoffGame) {
                var homeGoals = parseInt(playoffGame.HomeGoals, 10);
                var awayGoals = parseInt(playoffGame.AwayGoals, 10);
                if (isNaN(homeGoals) || isNaN(awayGoals)) return;

                var isHomeTeam;
                var proceedingTeam;
                var nextGameId;
                if (playoffGame.PlayoffGameDetails.NextPlayoffGame != null) {
                    proceedingTeam = betBaseController.getWinnerOfGame(playoffGame);

                    if (proceedingTeam == null) return;

                    isHomeTeam = playoffGame.PlayoffGameDetails.IsHomeTeamNextGame;
                    nextGameId = playoffGame.PlayoffGameDetails.NextPlayoffGame;
                    betBaseController.setNextPlayoffGame(nextGameId, proceedingTeam, isHomeTeam);
                }

                if (playoffGame.PlayoffGameDetails.NextPlayoffGameRunnerUp != null) {
                    proceedingTeam = betBaseController.getRunnerUpOfGame(playoffGame);

                    if (proceedingTeam == null) return;

                    isHomeTeam = playoffGame.PlayoffGameDetails.IsHomeTeamInRunnerUpGame;
                    nextGameId = playoffGame.PlayoffGameDetails.NextPlayoffGameRunnerUp;
                    betBaseController.setNextPlayoffGame(nextGameId, proceedingTeam, isHomeTeam);
                }

                betBaseController.modelChanged = true;
                betBaseController.clearMessages();
            };

            betBaseController.setNextPlayoffGame = function(nextGameId, proceedingTeam, isHomeTeam) {
                var stopLoop = false;

                angular.forEach(betBaseController.playoffGames, function(pg) {
                    if (stopLoop) return;
                    if (pg.Id == nextGameId) {

                        if (isHomeTeam) {
                            pg.HomeTeam = proceedingTeam;
                        } else {
                            pg.AwayTeam = proceedingTeam;
                        }
                        stopLoop = true;
                    }
                });
            };

            betBaseController.setTeamScore = function(team, opposingTeam, currentGame) {
                team.goalsScored += currentGame.HomeGoals;
                team.goalsConceded += currentGame.AwayGoals;
                var pointsForGame = betBaseController.setPointsForGame(currentGame.HomeGoals, currentGame.AwayGoals);
                team.points += betBaseController.setPointsForGame(currentGame.HomeGoals, currentGame.AwayGoals);
                if (pointsForGame == 3) team.gamesWonAgainstTeams.push(currentGame.AwayTeam.Id);
            };
            betBaseController.setPointsForGame = function(goalsScored, goalsConceded) {
                if (goalsScored > goalsConceded) return 3;
                if (goalsScored < goalsConceded) return 0;
                if (goalsScored == goalsConceded) return 1;
            };

            betBaseController.setWinnerAndRunnerUpInGroup = function(group) {
                group.Teams = betBaseController.orderTeamsBestFirst(group.Teams);
                group.Winner = group.Teams[0];
                group.RunnerUp = group.Teams[1];
                return group;
            };

            betBaseController.getWinnerOfGame = function(playoffGame) {
                if (playoffGame.HomeGoals > playoffGame.AwayGoals) {
                    return playoffGame.HomeTeam;
                } else if (playoffGame.AwayGoals > playoffGame.HomeGoals) {
                    return playoffGame.AwayTeam;
                }
                return null;
            };

            betBaseController.getRunnerUpOfGame = function(playoffGame) {
                if (playoffGame.HomeGoals < playoffGame.AwayGoals) {
                    return playoffGame.HomeTeam;
                }
                return playoffGame.AwayTeam;
            };

            betBaseController.clearTeamValues = function(team) {
                team.goalsScored = 0;
                team.goalsConceded = 0;
                team.points = 0;
                team.sumGoals = 0;
                team.gamesWonAgainstTeams = [];
                return team;
            };

            betBaseController.orderTeamsBestFirst = function(teams) {
                var sortedTeams = orderByFilter(teams, betBaseController.predicate, false);
                if (teamsAreEqualByPredicate(sortedTeams, 0, 1)) {
                    swapTeamsByGamesWonAgainstEachother(sortedTeams, 0, 1);
                    if (teamsAreEqualByPredicate(sortedTeams, 1, 2)) {
                        swapTeamsByGamesWonAgainstEachother(sortedTeams, 1, 2);
                        if (teamsAreEqualByPredicate(sortedTeams, 2, 3)) {
                            swapTeamsByGamesWonAgainstEachother(sortedTeams, 2, 3);
                            return sortedTeams;
                        }
                        return sortedTeams;
                    }
                    return sortedTeams;
                }
                return sortedTeams;
            };

            betBaseController.initializeGroupsForBet = function() {
                angular.forEach(betBaseController.groups, function(group) {
                    angular.forEach(group.Teams, function(team) {
                        team.goalsConceded = 0;
                        team.goalsScored = 0;
                        team.points = 0;
                        team.sumGoals = 0;
                    });

                    betBaseController.updateTeamsInGroup(group);

                    angular.forEach(group.Games, function(game) {
                        angular.forEach(game.TeamGames, function(teamGame) {
                            if (teamGame.IsHomeTeam) {
                                game.HomeTeam = teamGame.Team;
                            } else game.AwayTeam = teamGame.Team;
                        });

                    });
                });
            };

            betBaseController.initializePlayoffGamesForBet = function(playoffGames) {
                angular.forEach(playoffGames, function(playoffGame) {
                    playoffGame.PlayoffGameDetails = playoffGame.PlayoffGameDetails[0];
                });
                betBaseController.playoffGames = playoffGames;

            };

            betBaseController.clearMessages = function() {
                betBaseController.errorMessage = "";
                betBaseController.successMessage = "";
            };

            betBaseController.validateIfUserBetIsComplete = function () {
                var numberOfIncompleteGames = 0;
                angular.forEach(betBaseController.groups, function(group) {
                    angular.forEach(group.Games, function(game) {
                        var homeGoals = parseInt(game.HomeGoals, 10);
                        var awayGoals = parseInt(game.AwayGoals, 10);
                        if (isNaN(homeGoals) || isNaN(awayGoals)) {
                            numberOfIncompleteGames++;
                        }
                    });
                });

                angular.forEach(betBaseController.playoffGames, function (playoffGame) {
                    var homeGoals = parseInt(playoffGame.HomeGoals, 10);
                    var awayGoals = parseInt(playoffGame.AwayGoals, 10);
                    if (isNaN(homeGoals) || isNaN(awayGoals)) {
                        numberOfIncompleteGames++;
                    }
                });
                return numberOfIncompleteGames;
            };

            var teamsAreEqualByPredicate = function(sortedTeams, indexTeamOne, indexTeamTwo) {
                return sortedTeams[indexTeamOne].points == sortedTeams[indexTeamTwo].points &&
                    sortedTeams[indexTeamOne].sumGoals == sortedTeams[indexTeamTwo].sumGoals &&
                    sortedTeams[indexTeamOne].goalsScored == sortedTeams[indexTeamTwo].goalsScored;
            };
            var swapTeamsByGamesWonAgainstEachother = function(sortedTeams, indexTeamOne, indexTeamTwo) {
                if (isInArray(sortedTeams[indexTeamOne].Id, sortedTeams[indexTeamTwo].gamesWonAgainstTeams)) {
                    var firstTeam = sortedTeams[indexTeamOne];
                    sortedTeams[indexTeamOne] = sortedTeams[indexTeamTwo];
                    sortedTeams[indexTeamTwo] = firstTeam;
                }
            };

            return betBaseController;
        }
    ]);