/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Services {
    export interface IGroup extends ng.resource.IResource<IGroup> {
        id: number;
        name: string;
        winnerTeamCode: string;
        runnerUpTeamCode: string;
        winnerGameCode: number;
        runnerUpGameCode: number;
        sportsEventId: number;
        number: number;
        winner: ITeam;
        runnerUp: ITeam;
        teams: ITeam[];
        games: IGame[];
    }

    export interface ITeam {
        id: number;
        name: string;
        flag: string;
        groupId: number;
        sportsEventId: number;
        goalsScored: number;
        goalsConceded: number;
        points: number;
        sumGoals: number;
        gamesWonAgainstTeams: ITeam[];
    }

    export interface IGame {
        id: number;
        name: string;
        startTime: string;
        homeGoals: number;
        awayGoals: number;
        result: number;
        gameType: number;
        sportsEventId: number;
        homeTeam: ITeam;
        awayTeam: ITeam;
        teamGames: ITeamGame[];
        playoffGameDetails: IPlayoffGameDetails;
    }

    export interface IPlayoffGameDetails {
        isHomeTeamNextGame: boolean;
        nextPlayoffGame: number;
        nextPlayoffGameRunnerUp: number;
        isHomeTeamInRunnerUpGame: boolean;
        homeTeamDisplayName: string;
        awayTeamDisplayName: string;
        gameId: number;
    }

    export interface ITeamGame {
        id: number;
        teamId: number;
        isHomeTeam: boolean;
        gameId: number;
        team: ITeam;
    }

    export interface ILeaderboard {
        name: string;
        userName: string;
        points: number;
        position: number;
        playoffScore: number;
    }
}
