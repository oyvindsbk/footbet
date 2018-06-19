using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using Footbet.Helpers;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Models.Enums;
using Footbet.Repositories.Contracts;
using Footbet.ScoreCalculations;
using Footbet.Services.Contracts;

namespace Footbet.Services
{
    public class TodaysGamesService : ITodaysGamesService
    {
        private readonly IUserBetRepository _userBetRepository;
        private readonly IGameScoreCalculator _gameScoreCalculator;
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;
        private readonly IResultRepository _resultRepository;
        private readonly IScoreBasisRepository _scoreBasisRepository;
        private readonly IGameService _gameService;

        public TodaysGamesService(IUserBetRepository userBetRepository, ITeamRepository teamRepository,
            IUserRepository userRepository,
            IResultRepository resultRepository, IGameScoreCalculator gameScoreCalculator,
            IScoreBasisRepository scoreBasisRepository, IGameService gameService)
        {
            _userBetRepository = userBetRepository;
            _teamRepository = teamRepository;
            _userRepository = userRepository;
            _resultRepository = resultRepository;
            _gameScoreCalculator = gameScoreCalculator;
            _scoreBasisRepository = scoreBasisRepository;
            _gameService = gameService;
        }

        public TodaysGamesViewModel GetNextGames(DateTime date, int sportsEventId)
        {
            var todaysGames =
                _gameService.GetGamesForDateOrFollowingDateIfNoGamesOnThisDate(sportsEventId, date, true,
                    out var numberOfDaysFromToday);

            return MapToTodaysGamesViewModel(sportsEventId, todaysGames, numberOfDaysFromToday);
        }

        public TodaysGamesViewModel GetPreviousGames(DateTime date, int sportsEventId)
        {
            var todaysGames =
                _gameService.GetGamesForDateOrFollowingDateIfNoGamesOnThisDate(sportsEventId, date, false,
                    out var numberOfDaysFromToday);

            var numberOfDaysFromTodayNegated = numberOfDaysFromToday * -1;

            return MapToTodaysGamesViewModel(sportsEventId, todaysGames, numberOfDaysFromTodayNegated);
        }

        private TodaysGamesViewModel MapToTodaysGamesViewModel(int sportsEventId, IEnumerable<Game> todaysGames,
            int numberOfDaysFromToday)
        {
            var todaysGamesViewModel = new TodaysGamesViewModel();
            var userBets = _userBetRepository.GetAllUserBetsBySportsEventIdWithoutResultBet(sportsEventId);

            var teams = _teamRepository.GetTeamsBySportsEventId(sportsEventId);
            var result = _resultRepository.GetResultBySportsEventId(1);

            var todaysGamesSpecification = CreateTodaysGamesSpecification(todaysGames, result, userBets, teams);

            todaysGamesViewModel.NumberOfDaysFromToday = numberOfDaysFromToday;
            todaysGamesViewModel.TodaysGamesSpecification = todaysGamesSpecification;

            return todaysGamesViewModel;
        }

        private List<TodaysGamesSpecification> CreateTodaysGamesSpecification(
            IEnumerable<Game> todaysGames, Results result, List<UserBet> userBets, List<Team> teams)
        {
            var resultUserBet = new UserBet();
            if (EventHelpers.EventHasStarted())
            {
                if (result != null)
                    resultUserBet = _userBetRepository.GetUserBetById(result.UserBetId);

                return todaysGames
                    .Select(todaysGame => MapTodaysGamesAndBets(todaysGame, userBets, teams, resultUserBet)).ToList();
            }

            return todaysGames.Select(todaysGame => MapOnlyTodaysGames(todaysGame, teams)).ToList();
        }


        private TodaysGamesSpecification MapOnlyTodaysGames(Game todaysGame, List<Team> teams)
        {
            var todaysGamesSpecification = MapGameToTodaysGameSpecification(todaysGame);

            SetTeamsForTodaysGameSpecification(todaysGame, todaysGamesSpecification, null, teams);

            return todaysGamesSpecification;
        }

        private TodaysGamesSpecification MapTodaysGamesAndBets(Game todaysGame, IEnumerable<UserBet> userBets,
            List<Team> teams, UserBet resultUserBet)
        {
            var todaysGamesSpecification = MapGameToTodaysGameSpecification(todaysGame);

            SetTeamsForTodaysGameSpecification(todaysGame, todaysGamesSpecification, resultUserBet, teams);

            if (userBets == null || resultUserBet == null)
                return todaysGamesSpecification;

            SetResultsIfAvailable(resultUserBet, todaysGamesSpecification);
            SetValuesFromUserBets(todaysGame, userBets, todaysGamesSpecification, resultUserBet);
            todaysGamesSpecification.Bets = OrderByScoreOrNumberOfUsers(todaysGamesSpecification);
            return todaysGamesSpecification;
        }

        private static List<TodaysBet> OrderByScoreOrNumberOfUsers(TodaysGamesSpecification todaysGamesSpecification)
        {
            if(todaysGamesSpecification.Bets.Any(x=>x.UserBets.FirstOrDefault()?.Score != null))
                return todaysGamesSpecification.Bets
                    .OrderByDescending(x => x.UserBets.FirstOrDefault()?.Score)
                    .ThenByDescending(x=>x.UserBets.Count)
                    .ToList();
            return todaysGamesSpecification.Bets
                .OrderByDescending(x => x.UserBets.Count)
                .ToList();
        }

        private void SetValuesFromUserBets(Game todaysGame, IEnumerable<UserBet> userBets,
            TodaysGamesSpecification todaysGamesSpecification, UserBet resultUserBet)
        {
            var scoreBasis = _scoreBasisRepository.GetScoreBasisesBySportsEventId(1);

            foreach (var userBet in userBets)
            {
                if (IsGroupGame(todaysGamesSpecification))
                    SetValuesFromBetForGroupGame(todaysGame, todaysGamesSpecification, resultUserBet, userBet,
                        scoreBasis);

                if ((GameType) todaysGamesSpecification.GameType != GameType.GroupGame)
                    SetValuesForPlayoffGame(todaysGame, todaysGamesSpecification, userBet);
            }
        }


        private void SetValuesForPlayoffGame(Game todaysGame, TodaysGamesSpecification todaysGamesSpecification,
            UserBet userBet)
        {
            var userNameForUserBet = _userRepository.GetUserByUserId(userBet.UserId).UserName;
            int nextRoundGameType;
            if ((GameType) todaysGame.GameType == GameType.SemiFinals)
            {
                nextRoundGameType = todaysGame.GameType + 2;
            }
            else nextRoundGameType = todaysGame.GameType + 1;

            var betsForNextRound = userBet.PlayoffBets.Where(x => x.GameType == (nextRoundGameType)).ToList();

            if (!betsForNextRound.Any() || (GameType) todaysGame.GameType == GameType.BronzeFinals) return;

            foreach (var playoffBet in betsForNextRound)
            {
                if (todaysGamesSpecification.HomeTeam != null)
                {
                    if (TeamMatchesUsersNextRoundBet(todaysGamesSpecification.HomeTeam.Id, playoffBet))
                    {
                        SetValuesFromBetForPlayoffGame(todaysGamesSpecification, todaysGamesSpecification.HomeTeam,
                            userNameForUserBet);
                    }
                }

                if (todaysGamesSpecification.AwayTeam != null)
                {
                    if (TeamMatchesUsersNextRoundBet(todaysGamesSpecification.AwayTeam.Id, playoffBet))
                    {
                        SetValuesFromBetForPlayoffGame(todaysGamesSpecification, todaysGamesSpecification.AwayTeam,
                            userNameForUserBet);
                    }
                }
            }
        }

        private static bool TeamMatchesUsersNextRoundBet(int teamId, PlayoffBet playoffBet)
        {
            return playoffBet.AwayTeam == teamId || playoffBet.HomeTeam == teamId;
        }

        private void SetValuesFromBetForGroupGame(Game todaysGame, TodaysGamesSpecification todaysGamesSpecification,
            UserBet resultUserBet, UserBet userBet, List<ScoreBasis> scoreBasis)
        {
            var userNameForUserBet = _userRepository.GetUserByUserId(userBet.UserId).UserName;
            var currentGamesBet = userBet.Bets?.FirstOrDefault(x => x.GameId == todaysGame.Id);
            var currentGamesResultBet = resultUserBet?.Bets?.FirstOrDefault(x => x.GameId == todaysGame.Id);

            if (currentGamesBet == null) return;

            var userBetViewModel = CreateUserBetViewModel(todaysGame, scoreBasis, currentGamesResultBet,
                currentGamesBet, userNameForUserBet);

            AddUserBetToListForGroup(todaysGamesSpecification, currentGamesBet, userBetViewModel);
        }

        private static void SetValuesFromBetForPlayoffGame(TodaysGamesSpecification todaysGamesSpecification, Team team,
            string userNameForUserBet)
        {
            var teamKey = team.Name + " videre";
            var userBetViewModel = new UserBetViewModel {UserName = userNameForUserBet};

            AddOrUpdateTodaysBet(todaysGamesSpecification, teamKey, userBetViewModel);
        }

        private static void AddOrUpdateTodaysBet(TodaysGamesSpecification todaysGamesSpecification, string teamKey,
            UserBetViewModel userBetViewModel)
        {
            if (todaysGamesSpecification.Bets.Any(x => x.Result == teamKey))
            {
                AddUserBetToExistingResult(todaysGamesSpecification, teamKey, userBetViewModel);
            }
            else
            {
                AddNewTodaysBet(todaysGamesSpecification, teamKey, userBetViewModel);
            }
        }

        private static void AddNewTodaysBet(TodaysGamesSpecification todaysGamesSpecification, string teamKey,
            UserBetViewModel userBetViewModel)
        {
            var todaysBets = new TodaysBet {Result = teamKey, UserBets = new List<UserBetViewModel> {userBetViewModel}};
            todaysGamesSpecification.Bets.Add(todaysBets);
        }

        private static void AddUserBetToExistingResult(TodaysGamesSpecification todaysGamesSpecification, string teamKey,
            UserBetViewModel userBetViewModel)
        {
            todaysGamesSpecification.Bets
                .Where(x => x.Result == teamKey)
                .ToList()
                .ForEach(s => s.UserBets.Add(userBetViewModel));
        }

        private static void AddUserBetToListForGroup(TodaysGamesSpecification todaysGamesSpecification,
            Bet currentGamesBet, UserBetViewModel userBetViewModel)
        {
            var resultAsString = currentGamesBet.HomeGoals + "-" + currentGamesBet.AwayGoals;
            AddOrUpdateTodaysBet(todaysGamesSpecification, resultAsString, userBetViewModel);
        }

        private UserBetViewModel CreateUserBetViewModel(Game todaysGame, List<ScoreBasis> scoreBasis,
            Bet currentGamesResultBet, Bet currentGamesBet, string userNameForUserBet)
        {
            int? points = null;
            if (currentGamesResultBet != null)
            {
                points = _gameScoreCalculator.GetScoreForUserOnGame(currentGamesResultBet, currentGamesBet, todaysGame,
                    scoreBasis);
            }

            return new UserBetViewModel {Score = points, UserName = userNameForUserBet};
        }

        private void SetTeamsForTodaysGameSpecification(Game todaysGame,
            TodaysGamesSpecification todaysGamesSpecification, UserBet resultUserBet, List<Team> teams)
        {
            if (IsGroupGame(todaysGamesSpecification))
            {
                SetTeamValuesForGroupGames(todaysGame, todaysGamesSpecification, teams);
            }
            else SetTeamValuesForPlayoffGames(todaysGamesSpecification, resultUserBet, teams);
        }

        private static void SetTeamValuesForPlayoffGames(TodaysGamesSpecification todaysGamesSpecification,
            UserBet resultUserBet, List<Team> teams)
        {
            var playoffBet = resultUserBet?.PlayoffBets.FirstOrDefault(x => x.GameId == todaysGamesSpecification.Id);
            if (playoffBet == null)
            {
                SetValuesDefaultValuesForTeams(todaysGamesSpecification);
            }
            else
            {
                if (playoffBet.HomeTeam != null)
                {
                    todaysGamesSpecification.HomeTeam = teams.FirstOrDefault(x => x.Id == playoffBet.HomeTeam);
                }
                else SetDefaultValueForHomeTeam(todaysGamesSpecification);

                if (playoffBet.AwayTeam != null)
                {
                    todaysGamesSpecification.AwayTeam = teams.FirstOrDefault(x => x.Id == playoffBet.AwayTeam);
                }
                else SetDefaultValueForAwayTeam(todaysGamesSpecification);
            }
        }

        private static void SetValuesDefaultValuesForTeams(TodaysGamesSpecification todaysGamesSpecification)
        {
            SetDefaultValueForHomeTeam(todaysGamesSpecification);
            SetDefaultValueForAwayTeam(todaysGamesSpecification);
        }

        private static void SetDefaultValueForAwayTeam(TodaysGamesSpecification todaysGamesSpecification)
        {
            var playoffGameDetails = todaysGamesSpecification.PlayoffGameDetails.First();
            todaysGamesSpecification.AwayTeam = new Team {Name = playoffGameDetails.AwayTeamDisplayName};
        }

        private static void SetDefaultValueForHomeTeam(TodaysGamesSpecification todaysGamesSpecification)
        {
            var playoffGameDetails = todaysGamesSpecification.PlayoffGameDetails.First();
            todaysGamesSpecification.HomeTeam = new Team {Name = playoffGameDetails.HomeTeamDisplayName};
        }

        private void SetTeamValuesForGroupGames(Game todaysGame, TodaysGamesSpecification todaysGamesSpecification,
            List<Team> teams)
        {
            if (todaysGame.HomeTeam != null)
            {
                todaysGamesSpecification.HomeTeam = teams.FirstOrDefault(x => x.Id == todaysGame.HomeTeam);
            }

            if (todaysGame.AwayTeam != null)
            {
                todaysGamesSpecification.AwayTeam = teams.FirstOrDefault(x => x.Id == todaysGame.AwayTeam);
            }
        }


        private static void SetResultsIfAvailable(UserBet resultUserBet,
            TodaysGamesSpecification todaysGamesSpecification)
        {
            if ((GameType) todaysGamesSpecification.GameType == GameType.GroupGame)
            {
                var resultBet = resultUserBet?.Bets?.FirstOrDefault(x => x.GameId == todaysGamesSpecification.Id);
                SetGoalsFromResultBet(todaysGamesSpecification, resultBet);
            }
            else
            {
                var resultBet =
                    resultUserBet?.PlayoffBets?.FirstOrDefault(x => x.GameId == todaysGamesSpecification.Id);
                SetGoalsFromResultBet(todaysGamesSpecification, resultBet);
            }
        }

        private static void SetGoalsFromResultBet(TodaysGamesSpecification todaysGamesSpecification,
            PlayoffBet resultBet)
        {
            if (resultBet == null)
                return;
            todaysGamesSpecification.HomeGoals = resultBet.HomeGoals;
            todaysGamesSpecification.AwayGoals = resultBet.AwayGoals;
        }

        private static void SetGoalsFromResultBet(TodaysGamesSpecification todaysGamesSpecification, Bet resultBet)
        {
            if (resultBet == null)
                return;
            todaysGamesSpecification.HomeGoals = resultBet.HomeGoals;
            todaysGamesSpecification.AwayGoals = resultBet.AwayGoals;
        }

        private static bool IsGroupGame(TodaysGamesSpecification todaysGamesSpecification)
        {
            return (GameType) todaysGamesSpecification.GameType == GameType.GroupGame;
        }

        private static TodaysGamesSpecification MapGameToTodaysGameSpecification(Game game)
        {
            return new TodaysGamesSpecification
            {
                Id = game.Id,
                GameType = game.GameType,
                StartTime = game.StartTime.ToString("dd.MM.yy HH:mm", CultureInfo.InvariantCulture),
                Name = game.Name,
                SportsEventId = game.SportsEventId,
                PlayoffGameDetails = game.PlayoffGameDetails?.ToList(),
                Bets = new List<TodaysBet>()
            };
        }
    }

    public class TodaysBet
    {
        public string Result { get; set; }
        public List<UserBetViewModel> UserBets { get; set; }
    }

    public class UserBetViewModel
    {
        public string UserName { get; set; }
        public int? Score { get; set; }
    }
}