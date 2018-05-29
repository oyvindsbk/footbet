
module Services {

    export interface IBetViewModel  {
        groups: IGroup[];
        playoffGames: IGame[];
    }

    export interface IGroup {
        id: number;
        name: string;
        winnerGameId: number;
        runnerUpGameId: number;
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

    export interface IPlayer {
        name: string;
        team: ITeam;
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
        groupScore: number;
        bonusScore: number;
        position: number;
        playoffScore: number;
    }

    export interface ILeague {
        id: number;
        name: string;
        guid: string;
        numberOfMembers: number;
        sportsEventId: number;
        currentUsersPosition: number;
    }

    export interface ITodaysGames {
        numberOfDaysFromToday: number;
        isFirstDay: boolean;
        todaysGamesSpecification: ITodaysGamesSpecification[];
    }

    export interface ITodaysGamesSpecification {
        id: number;
        name: string;
        todaysDate: Date;
        startTime: string;
        homeGoals: number;
        awayGoals: number;
        result: number;
        gameType: number;
        sportsEventId: number;
        homeTeam: ITeam;
        awayTeam: ITeam;
        playoffGameDetails: IPlayoffGameDetails;
        bets: [string, string[]];
    }

    export interface IUser {
        name: string;
        userName: string;
    }

    export interface IResponse {
        message: string;
        isError: boolean;
    }

    
}
