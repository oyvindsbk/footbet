﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Resources;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Footbet.Controllers.Helpers;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;
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

        public BetController(JavaScriptSerializer javaScriptSerializer, IUserBetRepository userBetRepository, ITeamRepository teamRepository, IUserRepository userRepository)
        {
            _javaScriptSerializer = javaScriptSerializer;
            _userBetRepository = userBetRepository;
            _teamRepository = teamRepository;
            _userRepository = userRepository;
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

            var gameSetup = Resources.gameSetupBrasil;

            var betViewModel = _javaScriptSerializer.Deserialize<BetViewModel>(gameSetup);

            var userBet = GetUserBetForUserWithUserName(userName);

            if (userBet.Bets == null) return ToJsonResult(betViewModel);

            foreach (var group in betViewModel.Groups)
            {
                BetMappers.SetValuesFromExistingBets(group.Games, userBet);
            }

            MapPlayoffBetsToGameViewModels(betViewModel.PlayoffGames, userBet);

            return ToJsonResult(betViewModel);
        }

        private UserBet GetUserBetForUserWithUserName(string userName)
        {
            var userId = userName != null ? _userRepository.GetUserByUserName(userName).Id : GetUserId();
            var userBet = GetUserBetForUserWithId(userId);
            return userBet;
        }

        public UserBet GetUserBetForUserWithId(string userId)
        {
            return _userBetRepository.GetUserBetByUserId(userId);
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        public ActionResult SavePersonBet(string groupGamesResult, string playoffGamesResult, int sportsEventId = 1)
        {
            if (EventHasStarted())
            {
                return CreateJsonError("Kvartfinale 5 har startet!");//"VM er i gang! For sent å lagre spill nå :)
            }

            var groupGamesResultViewModel = _javaScriptSerializer.Deserialize<List<GameResultViewModel>>(groupGamesResult);
            var playoffGamesResultViewModel = _javaScriptSerializer.Deserialize<List<PlayoffBetViewModel>>(playoffGamesResult);

            var insertUserBetSuccess = CreateAndInsertUserBet(sportsEventId, groupGamesResultViewModel, playoffGamesResultViewModel);

            if (!insertUserBetSuccess)
                return CreateJsonError("Lagring mislyktes. Vennligst sørg for at ingen finalespillkamper ender uavgjort.");

            return Content("Ditt spill er lagret!");
        }

        private static bool EventHasStarted()
        {
            return DateTime.Now > new DateTime(2014, 06, 30, 16, 00, 00);
        }

        private bool CreateAndInsertUserBet(int sportsEventId, IEnumerable<GameResultViewModel> groupGamesResultViewModel, List<PlayoffBetViewModel> playoffGamesResultViewModel)
        {
            var userId = GetUserId();
            var userBet = CreateUserBet(groupGamesResultViewModel, playoffGamesResultViewModel, sportsEventId, userId);
            
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


        public UserBet CreateUserBet(IEnumerable<GameResultViewModel> gameResultViewModels, List<PlayoffBetViewModel> playoffGamesResultViewModel, int sportsEventId, string userId, bool isResultBet = false)
        {
            var userBet = new UserBet
            {
                SportsEventId = sportsEventId, 
                UserId = userId,
                IsResultBet = isResultBet,
                Bets = new List<Bet>(),
                CreatedAt = DateTime.Now,
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

        private List<PlayoffBet> ExtractBetsFromPlayOffGameResults(IEnumerable<PlayoffBetViewModel> playoffGamesResultViewModel, UserBet userBet)
        {
            var playoffBets = new List<PlayoffBet>();
            foreach (var playoffBetViewModel in playoffGamesResultViewModel)
            {
//                if (PlayoffBetHasMissingTeam(playoffBetViewModel))
//                {
//                    continue;
//                }

                var playoffBet = BetMappers.MapPlayoffGamesResultViewModelToPlayoffBets(playoffBetViewModel, userBet.Id);
                playoffBets.Add(playoffBet);
            }
            return playoffBets;
        }

        private static bool PlayoffBetHasMissingTeam(PlayoffBetViewModel playoffBetViewModel)
        {
            return playoffBetViewModel.HomeTeam == null && playoffBetViewModel.AwayTeam == null;
        }

        private List<Bet> ExtractBetsFromGameResults(IEnumerable<GameResultViewModel> gameResultViewModels, UserBet userBet)
        {
            return gameResultViewModels.Select(gameResultViewModel => BetMappers.MapGameResultViewModelToBet(gameResultViewModel, userBet.Id)).ToList();
        }

    }
}