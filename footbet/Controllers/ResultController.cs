using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Footbet.Controllers.Helpers;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Models.Enums;
using Footbet.Repositories.Contracts;

namespace Footbet.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ResultController : Common
    {
        private readonly IResultRepository _resultRepository;
        private readonly IUserScoreRepository _userScoreRepository;
        private readonly IUserBetRepository _userBetRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IScoreBasisRepository _scoreBasisRepository;
        private readonly JavaScriptSerializer _javaScriptSerializer;
        private readonly IGameScoreEvaluator _gameScoreEvaluator;
        private readonly BetController _betController;

        public ResultController(IResultRepository resultRepository, IUserScoreRepository userScoreRespository, IUserBetRepository userBetRepository, IGameRepository gameRepository,
            IScoreBasisRepository scoreBasisRepository, JavaScriptSerializer javaScriptSerializer, BetController betController, IGameScoreEvaluator gameScoreEvaluator)
        {
            _resultRepository = resultRepository;
            _userScoreRepository = userScoreRespository;
            _userBetRepository = userBetRepository;
            _gameRepository = gameRepository;
            _scoreBasisRepository = scoreBasisRepository;
            _javaScriptSerializer = javaScriptSerializer;
            _betController = betController;
            _gameScoreEvaluator = gameScoreEvaluator;
        }

        public ViewResult AddResult()
        {
            return View("AddResult");
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        public ActionResult SaveResultBets(string groupGamesResult, string playoffGamesResult, int sportsEventId = 1)
        {
            var groupGamesResultViewModel = _javaScriptSerializer.Deserialize<List<GameResultViewModel>>(groupGamesResult);
            var playoffGamesResultViewModel = _javaScriptSerializer.Deserialize<List<PlayoffBetViewModel>>(playoffGamesResult);

            var userId = GetUserId();

            var userBet = _betController.CreateUserBet(groupGamesResultViewModel, playoffGamesResultViewModel, sportsEventId, userId, true);

            var userBetId = _userBetRepository.SaveOrUpdateUserBet(userBet);

            var result = new Results
            {
                UserBetId = userBetId,
                SportsEventId = sportsEventId
            };

            _resultRepository.SaveOrUpdateResult(result);

            return UpdateUserScores(userBet);
        }

        private ActionResult UpdateUserScores(UserBet referenceUserBet, int sportsEventId = 1)
        {
            var invalidUserBets = "";
            var userBets = _userBetRepository.GetAllUserBetsBySportsEventIdWithoutResultBet(sportsEventId);

            var groupGames = _gameRepository.GetGroupGamesBySportsEventId(sportsEventId);

            var scoreBasis = _scoreBasisRepository.GetScoreBasisesBySportsEventId(sportsEventId);
            var userScores = _userScoreRepository.GetAllUserScoresBySportsEventId(sportsEventId);

            AddNewUserScoresBasedOnUserBets(sportsEventId, userBets, userScores);

            foreach (var userBet in userBets)
            {
                if (UserBetIsInvalid(userBet))
                {
                    invalidUserBets += "   " + userBet.UserId;
                    continue;
                }

                var referenceBets = referenceUserBet.Bets;
                var referencePlayoffBets = referenceUserBet.PlayoffBets;
                var currentUserScore = userScores.First(x => x.UserId == userBet.UserId);
                currentUserScore.Score = 0;
                if (currentUserScore.UserId == "96ef45fb-4da7-46d9-aa10-4e6994ec5c9e")
                {
                    currentUserScore.Score = -9;
                }

                foreach (var referenceBet in referenceBets)
                {
                    var currentBet = userBet.Bets.Single(x => x.GameId == referenceBet.GameId);
                    var currentGame = groupGames.First(x => x.Id == referenceBet.GameId);
                    currentUserScore.Score += _gameScoreEvaluator.GetScoreForUserOnGame(referenceBet, currentBet, currentGame, scoreBasis);
                }

                currentUserScore.PlayoffScore = AddScoresForPlayoffGames(currentUserScore, referencePlayoffBets, userBet, scoreBasis);

            }

            _userScoreRepository.SaveOrUpdateUserScores(userScores);

            return Content(invalidUserBets);
        }

        private bool UserBetIsInvalid(UserBet userBet)
        {
            if (userBet.Bets.Count != 48) return true;
            if (userBet.PlayoffBets.Count != 16) return true;
            return false;
        }

        private static int AddScoresForPlayoffGames(UserScore currentUserScore, ICollection<PlayoffBet> referencePlayoffBets, UserBet userBet, List<ScoreBasis> scoreBasis)
        {
            var playoffScore = 0;
            foreach (GameType gameType in (GameType[]) Enum.GetValues(typeof(GameType)))
            {
                if ((int) gameType == 1) continue;
                var scoreForGame = AddScoreForGameType(referencePlayoffBets, userBet, scoreBasis, (int)gameType);
                currentUserScore.Score += scoreForGame;
                playoffScore += scoreForGame;
            }
            return playoffScore;
        }

        private static int AddScoreForGameType(IEnumerable<PlayoffBet> referencePlayoffBets, UserBet userBet, IEnumerable<ScoreBasis> scoreBasis, int gameType)
        {
            var playoffBetsByGameTypeReference = referencePlayoffBets.Where(x => x.GameType == gameType).ToList();
            var usersBetByGameType = userBet.PlayoffBets.Where(x => x.GameType == gameType).ToList();
            var scoreBasisByGameType = scoreBasis.Where(x => x.GameType == gameType).ToList();

            if (gameType >= 5)
            {
                return AddScoreForEndingPlayoffGames(playoffBetsByGameTypeReference, usersBetByGameType, scoreBasisByGameType);
            }
            
            var playoffTeamsByGameTypeReference = CreateListOfPlayoffGamesByGameType(playoffBetsByGameTypeReference);
            var usersPlayoffTeamsByGameType = CreateListOfPlayoffGamesByGameType(usersBetByGameType);
            
            return AddScoreForNotEndingPlayoffGames(playoffTeamsByGameTypeReference, usersPlayoffTeamsByGameType, scoreBasisByGameType);
        }

        private static int AddScoreForNotEndingPlayoffGames(IEnumerable<int?> playoffTeamsByGameTypeReference,ICollection<int?> usersPlayoffTeamsByGameType, List<ScoreBasis> scoreBasisByGameType)
        {
            var scoreForGameType = 0;
            foreach (var playoffBetReference in playoffTeamsByGameTypeReference)
            {
                if (usersPlayoffTeamsByGameType.Contains(playoffBetReference))
                    scoreForGameType += scoreBasisByGameType.First().Points;
            }
            return scoreForGameType;
        }

        private static int AddScoreForEndingPlayoffGames(IEnumerable<PlayoffBet> playoffBetsByGameTypeReference, IEnumerable<PlayoffBet> usersBetByGameType, List<ScoreBasis> scoreBasisByGameType)
        {
            var scoreForGameType = 0;
            if (!playoffBetsByGameTypeReference.Any()) return 0;
            
            var playoffGameResult = playoffBetsByGameTypeReference.First();
            
            var userPlayoffGame = usersBetByGameType.First();

            var winningTeamResult = GetWinningTeamFromGame(playoffGameResult);
            var runnerUpTeamResult = GetRunnerUpTeamFromGame(playoffGameResult);


            var usersWinningTeam = GetWinningTeamFromGame(userPlayoffGame);
            var usersRunnerUpTeam = GetRunnerUpTeamFromGame(userPlayoffGame);

            if (winningTeamResult != null && winningTeamResult == usersWinningTeam)
            {
                var scoreBasisWinningTeam = scoreBasisByGameType.First(x => !x.IsRunnerUp);
                scoreForGameType += scoreBasisWinningTeam.Points;
            }
            if (runnerUpTeamResult != null && runnerUpTeamResult == usersRunnerUpTeam)
            {
                var scoreBasisRunnerUp = scoreBasisByGameType.First(x => x.IsRunnerUp);
                scoreForGameType += scoreBasisRunnerUp.Points;
            }
            return scoreForGameType;
        }

        private static int? GetRunnerUpTeamFromGame(PlayoffBet playoffGame)
        {
            if (playoffGame.Result == null || playoffGame.Result == 1) return null;
            return playoffGame.Result == 0 ? playoffGame.AwayTeam : playoffGame.HomeTeam;
        }

        private static int? GetWinningTeamFromGame(PlayoffBet playoffGame)
        {
            if (playoffGame.Result == null || playoffGame.Result == 1) return null;
            return playoffGame.Result == 0 ? playoffGame.HomeTeam : playoffGame.AwayTeam;
        }

        private static List<int?> CreateListOfPlayoffGamesByGameType(IEnumerable<PlayoffBet> playoffBetsByGameTypeReference)
        {
            var playoffTeamsByGameTypeReference = new List<int?>();

            foreach (var playoffBetReference in playoffBetsByGameTypeReference)
            {
                playoffTeamsByGameTypeReference.Add(playoffBetReference.HomeTeam);
                playoffTeamsByGameTypeReference.Add(playoffBetReference.AwayTeam);
            }
            return playoffTeamsByGameTypeReference;
        }


        private static void AddNewUserScoresBasedOnUserBets(int sportsEventId, IEnumerable<UserBet> userBets, ICollection<UserScore> userScores)
        {
            foreach (var userBet in userBets)
            {
                if (UserScoreExists(userScores, userBet)) continue;

                userScores.Add(new UserScore
                {
                    UserId = userBet.UserId, 
                    SportsEventId = sportsEventId, 
                    Score = 0
                });
            }
        }

        private static bool UserScoreExists(IEnumerable<UserScore> userScores, UserBet userBet)
        {
            return userScores.Any(x => x.UserId == userBet.UserId);
        }
    }
}