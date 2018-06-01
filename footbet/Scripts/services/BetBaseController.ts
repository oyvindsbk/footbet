module Services {

    export class BetBaseController {
        isRequired = true;
        groups: IGroup[];
        selectedTopScorer: IPlayer;
        players: IPlayer[];
        playoffGames: IGame[];
        groupResults: IGame[];
        playoffGamesResults: IGame[];
        predicate = ["-points", "-sumGoals", "-goalsScored"];
        playoffTypes = { 2: '8-delsfinaler', 3: 'Kvartfinaler', 4: 'Semifinaler', 5: 'Bronsefinale', 6: 'Finale' };
        displayedPlayoffTypes: number[];
        modelChanged = false;
        isLoading = false;

        static $inject = [
            "$resource",
            "$rootScope",
            "orderByFilter",
            "toaster",
            "$location"
        ];

        constructor(
            private $resource,
            private $rootScope: ng.IRootScopeService,
            private orderByFilter,
            private toaster,
            private $location) { }

        public loadModel(userName): void {
            this.$resource(`../Bet/GetBasisForBet/${userName}`).get((betViewModel) => {
                if (betViewModel.ExceptionMessage != null) {
                    this.$rootScope.$broadcast("modelLoaded", true);
                    this.toaster.pop('warning', "Feil", betViewModel.ExceptionMessage);
                } else {
                    this.groups = betViewModel.groups;
                    this.players = betViewModel.players;
                    this.selectedTopScorer = betViewModel.selectedTopScorer;
                    this.initializeGroupsForBet();
                    this.initializePlayoffGamesForBet(betViewModel.playoffGames);
                    this.$rootScope.$broadcast("modelLoaded", true);
                }
            });
        }

        public scoreChanged(group: IGroup, game: IGame): void {

            if (isNaN(game.homeGoals) || isNaN(game.awayGoals)) return;

            this.updateTeamsInGroup(group);
            
            this.setWinnerAndRunnerUpInGroup(group);
            this.setPlayoffGameTeams(group, true);

            this.modelChanged = true;
        }

        public setPlayoffGameTeams(group: IGroup, setPlayoffGamesRecursively: boolean): void {
            var shouldSetPlayoffGameTeams = true;
            angular.forEach(group.games, game => {
                if (game.homeGoals == null || game.awayGoals == null)
                    shouldSetPlayoffGameTeams = false;
            });

            if (!shouldSetPlayoffGameTeams) return;

            angular.forEach(this.playoffGames, (playoffGame) => {
                if (playoffGame.id === group.winnerGameId) {
                    playoffGame.homeTeam = group.winner;
                }
                if (playoffGame.id === group.runnerUpGameId) {
                    playoffGame.awayTeam = group.runnerUp;
                }
                if (setPlayoffGamesRecursively)
                    this.playoffGameScoreChanged(playoffGame);
            });
        }

        public playoffAwayTeamSelected(playoffGame: IGame) {
            playoffGame.homeGoals = 0;
            playoffGame.awayGoals = 1;
            this.playoffGameScoreChanged(playoffGame);
        }

        public playoffHomeTeamSelected(playoffGame: IGame) {
            playoffGame.homeGoals = 1;
            playoffGame.awayGoals = 0;
            this.playoffGameScoreChanged(playoffGame);
        }

        public displayPlayoffHeader(gameType: number) {
            var playoffType = this.playoffTypes[gameType];
            if (!this.displayedPlayoffTypes.includes(gameType)) {
                this.displayedPlayoffTypes.push(gameType);
                return playoffType;
            }
            return null;
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

        private playoffGameScoreChanged(playoffGame: IGame): void {
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
        }


        private setNextPlayoffGame(nextGameId: number, proceedingTeam: ITeam, isHomeTeam: boolean): void {
            angular.forEach(this.playoffGames, pg => {
                if (pg.id === nextGameId) {

                    if (isHomeTeam) {
                        pg.homeTeam = proceedingTeam;
                    } else {
                        pg.awayTeam = proceedingTeam;
                    }
                    this.playoffGameScoreChanged(pg);
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
                    if (this.isGameIncomplete(game)) {
                        numberOfIncompleteGames++;
                    }
                });
            });

            angular.forEach(this.playoffGames, playoffGame => {
                if (this.isGameIncomplete(playoffGame)) {
                    numberOfIncompleteGames++;
                }
            });

            if (!this.selectedTopScorer)
                numberOfIncompleteGames++;

            return numberOfIncompleteGames;
        }

        private isGameIncomplete(game: IGame) : boolean {
            return (game.homeGoals !== 0 && !game.homeGoals) || (game.awayGoals !== 0 && !game.awayGoals);
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

