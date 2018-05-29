using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Resources;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Footbet.Extentions;
using Footbet.Helpers;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;
using Footbet.Services.Contracts;
using Microsoft.AspNet.Identity;

namespace Footbet.Controllers
{
    [Authorize]
    public class BetController : Common
    {
        private readonly IUserBetRepository _userBetRepository;
        private readonly JavaScriptSerializer _javaScriptSerializer;
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IPlayerService _playerService;

        public BetController(JavaScriptSerializer javaScriptSerializer,
            IUserBetRepository userBetRepository,
            ITeamRepository teamRepository,
            IUserRepository userRepository,
            IGroupRepository groupRepository, IGameRepository gameRepository, IPlayerService playerService)
        {
            _javaScriptSerializer = javaScriptSerializer;
            _userBetRepository = userBetRepository;
            _teamRepository = teamRepository;
            _userRepository = userRepository;
            _groupRepository = groupRepository;
            _gameRepository = gameRepository;
            _playerService = playerService;
        }

        public ViewResult Index()
        {
            return View("Index");
        }

        public ActionResult GetBasisForBet(string userName, int sportsEventId = 1)
        {
            if (userName == null)
            {
                userName = User.Identity.GetUserName();
            }

            var gameSetup = Resources.gameSetupRussia;
            var betViewModel = _javaScriptSerializer.Deserialize<BetViewModel>(gameSetup);
            betViewModel.Players = _playerService.GetPlayerViewModels();


            var userBet = GetUserBetForUserWithUserName(userName);

            if (userBet.Bets == null)
                return ToJsonResult(betViewModel);

            betViewModel.SelectedTopScorer = GetSelectedTopScorer(userBet);

            foreach (var group in betViewModel.Groups)
            {
                BetMappers.SetValuesFromExistingBets(group.Games, userBet);
            }

            MapPlayoffBetsToGameViewModels(betViewModel.PlayoffGames, userBet);

            return ToJsonResult(betViewModel);
        }

        private PlayerViewModel GetSelectedTopScorer(UserBet userBet)
        {
            if (userBet.TopScorerTeam == null)
                return null;
            var team = _teamRepository.GetTeamById(userBet.TopScorerTeam);
            return new PlayerViewModel {Name = userBet.TopScorerName, Team = team};
        }

        private List<GameViewModel> GetPlayoffGames()
        {
            var games = _gameRepository.GetPlayOffGamesBySportsEventId(1);

            return games.Select(game => new GameViewModel
                {
                    PlayoffGameDetails = game.PlayoffGameDetails.ToList(),
                    Id = game.Id,
                    SportsEventId = game.SportsEventId,
                    StartTime = game.StartTime.ToFormattedString(),
                    GameType = game.GameType,
                    Name = game.Name,
                    
                })
                .ToList();
        }

        private static GroupViewModel MapToGroupViewModel(Group group)
        {
            return new GroupViewModel
            {
                Id = group.Id,
                Name = group.Name,
                RunnerUpGameId = group.RunnerUpGameId,
                WinnerGameId = group.WinnerGameId,
                SportsEventId = group.SportsEventId,
                Teams = group.Teams.Select(team => MapToTeamViewModel(group, team)).ToList(),
                Games = group.Games.Select(groupGame => MapGameViewModel(group, groupGame)).ToList()
            };
        }

        private static TeamViewModel MapToTeamViewModel(Group group, Team team)
        {
            return new TeamViewModel
            {
                Flag = team.Flag,
                GroupId = group.Id,
                Id = team.Id,
                Name = team.Name,
                SportsEventId = team.SportsEventId
            };
        }

        private static GameViewModel MapGameViewModel(Group group, Game groupGame)
        {
           return new GameViewModel
            {
                HomeTeam = group.Teams.First(x => x.Id == groupGame.HomeTeam),
                AwayTeam = group.Teams.First(x => x.Id == groupGame.AwayTeam),
                GameType = groupGame.GameType,
                Id = groupGame.Id,
                SportsEventId = groupGame.SportsEventId,
                StartTime = groupGame.StartTime.ToFormattedString(),
                Name = groupGame.Name
            };
        }

        private UserBet GetUserBetForUserWithUserName(string userName)
        {
            var userId = !string.IsNullOrEmpty(userName) ? _userRepository.GetUserByUserName(userName).Id : GetUserId();
            var userBet = GetUserBetForUserWithId(userId);
            return userBet;
        }

        public UserBet GetUserBetForUserWithId(string userId)
        {
            return _userBetRepository.GetUserBetByUserId(userId);
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        public ActionResult SavePersonBet(string groupGamesResult, string playoffGamesResult, string selectedTopScorer, int sportsEventId = 1)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return CreateJsonError("Du er ikke logget inn.");
            }

            if (EventHelpers.EventHasStarted())
            {
                return CreateJsonError("VM er i gang! For sent å lagre spill nå :)"); 
            }

            var groupGamesResultViewModel =
                _javaScriptSerializer.Deserialize<List<GameResultViewModel>>(groupGamesResult);
            var playoffGamesResultViewModel =
                _javaScriptSerializer.Deserialize<List<PlayoffBetViewModel>>(playoffGamesResult);

            var playerViewModel = new PlayerViewModel();
            if(selectedTopScorer != null)
                playerViewModel = _javaScriptSerializer.Deserialize<PlayerViewModel>(selectedTopScorer);

            var insertUserBetSuccess =
                CreateAndInsertUserBet(sportsEventId, groupGamesResultViewModel, playerViewModel, playoffGamesResultViewModel);

            if (!insertUserBetSuccess)
                return CreateJsonError(
                    "Lagring mislyktes. Vennligst sørg for at ingen finalespillkamper ender uavgjort.");

            return Content("Ditt spill er lagret!");
        }

       private bool CreateAndInsertUserBet(int sportsEventId,
           IEnumerable<GameResultViewModel> groupGamesResultViewModel,
           PlayerViewModel topScorerBet,
           List<PlayoffBetViewModel> playoffGamesResultViewModel)
        {
            var userId = GetUserId();
            var userBet = CreateUserBet(groupGamesResultViewModel, playoffGamesResultViewModel, topScorerBet, sportsEventId, userId);

            if (PlayoffBetsNotValid(userBet)) return false;

            _userBetRepository.SaveOrUpdateUserBet(userBet);

            return true;
        }

        private static bool PlayoffBetsNotValid(UserBet userBet)
        {
            return userBet.PlayoffBets
                .Where(playoffBet => playoffBet.HomeGoals != null && playoffBet.AwayGoals != null)
                .Any(playoffBet => playoffBet.HomeGoals == playoffBet.AwayGoals);
        }


        public UserBet CreateUserBet(IEnumerable<GameResultViewModel> gameResultViewModels,
            List<PlayoffBetViewModel> playoffGamesResultViewModel, PlayerViewModel topScorerBet, int sportsEventId, string userId,
            bool isResultBet = false)
        {
            var userBet = new UserBet
            {
                SportsEventId = sportsEventId,
                UserId = userId,
                IsResultBet = isResultBet,
                Bets = new List<Bet>(),
                CreatedAt = DateTime.Now,
                TopScorerName =  topScorerBet?.Name,
                TopScorerTeam = topScorerBet?.Team?.Id,
                PlayoffBets = new List<PlayoffBet>(),
            };

            userBet.Bets = ExtractBetsFromGameResults(gameResultViewModels, userBet);
            userBet.PlayoffBets = ExtractBetsFromPlayOffGameResults(playoffGamesResultViewModel, userBet);
            return userBet;
        }

        private void MapPlayoffBetsToGameViewModels(IEnumerable<GameViewModel> playoffGames, UserBet userBet)
        {
            foreach (var game in playoffGames)
            {
                if (userBet.PlayoffBets != null)
                    SetExistingValuesFromPlayoffBet(game, userBet.PlayoffBets);
            }
        }

        private void SetExistingValuesFromPlayoffBet(GameViewModel gameViewModel, IEnumerable<PlayoffBet> playoffBets)
        {
            var matchingBet = playoffBets.SingleOrDefault(x => x.GameId == gameViewModel.Id);

            if (matchingBet == null) return;


            gameViewModel.HomeTeam = _teamRepository.GetTeamById(matchingBet.HomeTeam);
            gameViewModel.AwayTeam = _teamRepository.GetTeamById(matchingBet.AwayTeam);

            gameViewModel.HomeGoals = matchingBet.HomeGoals;
            gameViewModel.AwayGoals = matchingBet.AwayGoals;
        }

        private List<PlayoffBet> ExtractBetsFromPlayOffGameResults(
            IEnumerable<PlayoffBetViewModel> playoffGamesResultViewModel, UserBet userBet)
        {
            var playoffBets = new List<PlayoffBet>();
            foreach (var playoffBetViewModel in playoffGamesResultViewModel)
            {
//                if (PlayoffBetHasMissingTeam(playoffBetViewModel))
//                {
//                    continue;
//                }

                var playoffBet =
                    BetMappers.MapPlayoffGamesResultViewModelToPlayoffBets(playoffBetViewModel, userBet.Id);
                playoffBets.Add(playoffBet);
            }

            return playoffBets;
        }

        private static bool PlayoffBetHasMissingTeam(PlayoffBetViewModel playoffBetViewModel)
        {
            return playoffBetViewModel.HomeTeam == null && playoffBetViewModel.AwayTeam == null;
        }

        private List<Bet> ExtractBetsFromGameResults(IEnumerable<GameResultViewModel> gameResultViewModels,
            UserBet userBet)
        {
            return gameResultViewModels.Select(gameResultViewModel =>
                BetMappers.MapGameResultViewModelToBet(gameResultViewModel, userBet.Id)).ToList();
        }
    }
}