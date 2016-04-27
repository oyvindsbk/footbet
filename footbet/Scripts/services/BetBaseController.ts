﻿module Services {
    "use strict";

    export class BetBaseController {
        isRequired = true;
        groups: IGroup[];
        playoffGames: IGame[];
        groupResults: IGame[];
        playoffGamesResults: IGame[];
        predicate = ["-points", "-sumGoals", "-goalsScored"];
        modelChanged = false;
        errorMessage: string;
        successMessage: string;
        static $inject = [
            "$resource",
            "$rootScope"
        ];

        constructor(
            private $resource,
            private $rootScope: ng.IRootScopeService,
            private orderByFilter) {}

        public loadModel(userName): void {
            this.$resource(`../Bet/GetBasisForBet/${userName}`).get((betViewModel) => {
                this.groups = betViewModel.Groups;
                this.initializeGroupsForBet();
                this.initializePlayoffGamesForBet(betViewModel.PlayoffGames);
                this.$rootScope.$broadcast("modelLoaded", true);

            });
            // onFail: this.errorMessage = status;
        }

        public scoreChanged(group: IGroup, game: IGame): void {

            if (isNaN(game.homeGoals) || isNaN(game.awayGoals)) return;

            this.updateTeamsInGroup(group);


            this.setWinnerAndRunnerUpInGroup(group);
            this.setPlayoffGameTeams(group, true);

            this.modelChanged = true;
            this.clearMessages();
        }

        public setPlayoffGameTeams(group: IGroup, setPlayoffGamesRecursively: boolean): void {
            var shouldSetPlayoffGameTeams = true;
            angular.forEach(group.games, game => {
                if (game.homeGoals == null || game.awayGoals == null)
                    shouldSetPlayoffGameTeams = false;
            });

            if (!shouldSetPlayoffGameTeams) return;

            angular.forEach(this.playoffGames, (playoffGame) => {
                if (playoffGame.id === group.winnerGameCode) {
                    playoffGame.homeTeam = group.winner;
                }
                if (playoffGame.id === group.runnerUpGameCode) {
                    playoffGame.awayTeam = group.runnerUp;
                }
                if (setPlayoffGamesRecursively)
                    this.playoffGameScoreChanged(playoffGame);
            });
        }

        private updateTeamsInGroup(group: IGroup) {
            angular.forEach(group.teams, team => {
                team = this.clearTeamValues(team);
                angular.forEach(group.games, currentGame => {
                    var pointsForGame: number;
                    if (currentGame.homeGoals != null && currentGame.awayGoals != null) {
                        if (currentGame.homeTeam.id === team.id) {
                            team.goalsScored += currentGame.homeGoals;
                            team.goalsConceded += currentGame.awayGoals;
                            pointsForGame = this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
                            team.points += this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
                            if (pointsForGame === 3) team.gamesWonAgainstTeams.push(currentGame.awayTeam);
                        }
                        if (currentGame.awayTeam.id === team.id) {
                            team.goalsScored += currentGame.awayGoals;
                            team.goalsConceded += currentGame.homeGoals;
                            pointsForGame = this.setPointsForGame(currentGame.awayGoals, currentGame.homeGoals);
                            team.points += pointsForGame;
                            if (pointsForGame === 3) team.gamesWonAgainstTeams.push(currentGame.homeTeam);
                        }
                    }
                });
                team.sumGoals = team.goalsScored - team.goalsConceded;
            });
        }

        private clearTeamValues(team: ITeam) {
            team.goalsScored = 0;
            team.goalsConceded = 0;
            team.points = 0;
            team.sumGoals = 0;
            team.gamesWonAgainstTeams = [];
            return team;
        }

        private setPointsForGame(goalsScored: number, goalsConceded: number): number {
            if (goalsScored > goalsConceded) return 3;
            if (goalsScored < goalsConceded) return 0;
            if (goalsScored === goalsConceded) return 1;
            return 0;
        }

        initializeGroupsForBet(): void {
            angular.forEach(this.groups, group => {
                angular.forEach(group.teams, team => {
                    team.goalsConceded = 0;
                    team.goalsScored = 0;
                    team.points = 0;
                    team.sumGoals = 0;
                });

                this.updateTeamsInGroup(group);

                angular.forEach(group.games, game => {
                    angular.forEach(game.teamGames, teamGame => {
                        if (teamGame.isHomeTeam) {
                            game.homeTeam = teamGame.team;
                        } else game.awayTeam = teamGame.team;
                    });

                });
            });
        }

        initializePlayoffGamesForBet(playoffGames: IGame[]) {
            angular.forEach(playoffGames, playoffGame => {
                playoffGame.playoffGameDetails = playoffGame.playoffGameDetails[0];
            });
            this.playoffGames = playoffGames;
        }

        public setWinnerAndRunnerUpInGroup(group: IGroup): IGroup {
            group.teams = this.orderTeamsBestFirst(group.teams);
            group.winner = group.teams[0];
            group.runnerUp = group.teams[1];
            return group;
        }

        private orderTeamsBestFirst(teams: ITeam[]) {
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
        }

        public clearMessages() {
            this.errorMessage = "";
            this.successMessage = "";
        }

        private playoffGameScoreChanged(playoffGame: IGame): void {
            if (playoffGame.homeGoals || playoffGame.awayGoals)
                return;

            var isHomeTeam: boolean;
            var proceedingTeam: ITeam;
            var nextGameId: number;
            if (playoffGame.playoffGameDetails.nextPlayoffGame != null) {
                proceedingTeam = this.getWinnerOfGame(playoffGame);

                if (proceedingTeam == null) return;

                isHomeTeam = playoffGame.playoffGameDetails.isHomeTeamNextGame;
                nextGameId = playoffGame.playoffGameDetails.nextPlayoffGame;
                this.setNextPlayoffGame(nextGameId, proceedingTeam, isHomeTeam);
            }

            if (playoffGame.playoffGameDetails.nextPlayoffGameRunnerUp != null) {
                proceedingTeam = this.getRunnerUpOfGame(playoffGame);

                if (proceedingTeam == null) return;

                isHomeTeam = playoffGame.playoffGameDetails.isHomeTeamInRunnerUpGame;
                nextGameId = playoffGame.playoffGameDetails.nextPlayoffGameRunnerUp;
                this.setNextPlayoffGame(nextGameId, proceedingTeam, isHomeTeam);
            }

            this.modelChanged = true;
            this.clearMessages();
        }


        private setNextPlayoffGame(nextGameId: number, proceedingTeam: ITeam, isHomeTeam: boolean): void {
            var stopLoop = false;

            angular.forEach(this.playoffGames, pg => {
                if (stopLoop) return;
                if (pg.id === nextGameId) {

                    if (isHomeTeam) {
                        pg.homeTeam = proceedingTeam;
                    } else {
                        pg.awayTeam = proceedingTeam;
                    }
                    stopLoop = true;
                }
            });
        }

        private getWinnerOfGame(playoffGame: IGame): ITeam {
            if (playoffGame.homeGoals > playoffGame.awayGoals) {
                return playoffGame.homeTeam;
            } else if (playoffGame.awayGoals > playoffGame.homeGoals) {
                return playoffGame.awayTeam;
            }
            return null;
        }

        private getRunnerUpOfGame(playoffGame: IGame) {
            if (playoffGame.homeGoals < playoffGame.awayGoals) {
                return playoffGame.homeTeam;
            }
            return playoffGame.awayTeam;
        }

        private setTeamScore(team: ITeam, opposingTeam: ITeam, currentGame: IGame) {
            team.goalsScored += currentGame.homeGoals;
            team.goalsConceded += currentGame.awayGoals;
            var pointsForGame = this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
            team.points += this.setPointsForGame(currentGame.homeGoals, currentGame.awayGoals);
            if (pointsForGame === 3) team.gamesWonAgainstTeams.push(currentGame.awayTeam);
        }

        public validateIfUserBetIsComplete(): number {
            var numberOfIncompleteGames = 0;
            angular.forEach(this.groups, group => {
                angular.forEach(group.games, game => {
                    if (isNaN(game.homeGoals) || isNaN(game.awayGoals)) {
                        numberOfIncompleteGames++;
                    }
                });
            });

            angular.forEach(this.playoffGames, playoffGame => {
                if (isNaN(playoffGame.homeGoals) || isNaN(playoffGame.awayGoals)) {
                    numberOfIncompleteGames++;
                }
            });
            return numberOfIncompleteGames;
        }

        private teamsAreEqualByPredicate(sortedTeams: ITeam[], indexTeamOne: number, indexTeamTwo: number): boolean {
            return sortedTeams[indexTeamOne].points === sortedTeams[indexTeamTwo].points &&
                sortedTeams[indexTeamOne].sumGoals === sortedTeams[indexTeamTwo].sumGoals &&
                sortedTeams[indexTeamOne].goalsScored === sortedTeams[indexTeamTwo].goalsScored;
        }

        private swapTeamsByGamesWonAgainstEachother(sortedTeams, indexTeamOne, indexTeamTwo) {
            if (this.isInArray(sortedTeams[indexTeamOne].id, sortedTeams[indexTeamTwo].gamesWonAgainstTeams)) {
                var firstTeam = sortedTeams[indexTeamOne];
                sortedTeams[indexTeamOne] = sortedTeams[indexTeamTwo];
                sortedTeams[indexTeamTwo] = firstTeam;
            }
        }

        private isInArray (value, array) {
            return array.indexOf(value) > -1;
        }
    }
}
