using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Footbet.Caching;
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
        private readonly ICacheService _cacheService;


        public ResultController(
            IResultRepository resultRepository, 
            IUserBetRepository userBetRepository, 
            JavaScriptSerializer javaScriptSerializer, 
            BetController betController, 
            IUserScoreService userScoreService, 
            ICacheService cacheService)
        {
            _resultRepository = resultRepository;
            _userBetRepository = userBetRepository;
            _javaScriptSerializer = javaScriptSerializer;
            _betController = betController;
            _userScoreService = userScoreService;
            _cacheService = cacheService;
        }

        public ViewResult AddResult()
        {
            return View("AddResult");
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        public ActionResult SaveResultBets(string groupGamesResult, string playoffGamesResult, string topScorerResult, int sportsEventId = 1)
        {
            _cacheService.ClearAll();
            var groupGamesResultViewModel = _javaScriptSerializer.Deserialize<List<GameResultViewModel>>(groupGamesResult);
            var playoffGamesResultViewModel = _javaScriptSerializer.Deserialize<List<PlayoffBetViewModel>>(playoffGamesResult);
            var topScorerBet = topScorerResult != null ? _javaScriptSerializer.Deserialize<PlayerViewModel>(topScorerResult) : null;

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
            _cacheService.ClearAll();

            return Content(invalidUserScores);
        }
    }
}