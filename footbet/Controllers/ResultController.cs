﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Footbet.Helpers;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Models.Enums;
using Footbet.Repositories.Contracts;
using Footbet.ScoreCalculations;
using Footbet.Services.Contracts;

namespace Footbet.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ResultController : Common
    {
        private readonly IResultRepository _resultRepository;
        private readonly BetController _betController;
        private readonly JavaScriptSerializer _javaScriptSerializer;
        private readonly IUserBetRepository _userBetRepository;
        private readonly IUserScoreService _userScoreService;

        public ResultController(
            IResultRepository resultRepository, 
            IUserBetRepository userBetRepository, 
            JavaScriptSerializer javaScriptSerializer, 
            BetController betController, 
            IUserScoreService userScoreService)
        {
            _resultRepository = resultRepository;
            _userBetRepository = userBetRepository;
            _javaScriptSerializer = javaScriptSerializer;
            _betController = betController;
            _userScoreService = userScoreService;
        }

        public ViewResult AddResult()
        {
            return View("AddResult");
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        public ActionResult SaveResultBets(string groupGamesResult, string playoffGamesResult, string playoffBetViewModel, int sportsEventId = 1)
        {
            var groupGamesResultViewModel = _javaScriptSerializer.Deserialize<List<GameResultViewModel>>(groupGamesResult);
            var playoffGamesResultViewModel = _javaScriptSerializer.Deserialize<List<PlayoffBetViewModel>>(playoffGamesResult);
            var topScorerBet = _javaScriptSerializer.Deserialize<PlayerViewModel>(playoffGamesResult);

            var userId = GetUserId();

            var userBet = _betController.CreateUserBet(groupGamesResultViewModel, playoffGamesResultViewModel, topScorerBet, sportsEventId, userId, true);

            var userBetId = _userBetRepository.SaveOrUpdateUserBet(userBet);

            var result = new Results
            {
                UserBetId = userBetId,
                SportsEventId = sportsEventId
            };

            _resultRepository.SaveOrUpdateResult(result);

            var invalidUserScores = _userScoreService.UpdateUserScores(userBet);
            return Content(invalidUserScores);
        }
    }
}