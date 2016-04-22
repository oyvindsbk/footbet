using System;
using System.Web.Mvc;
using Footbet.Services.Contracts;

namespace Footbet.Controllers
{
    public class TodaysGamesController : Common
    {

        private readonly ITodaysGamesService _todaysGamesService;
        public TodaysGamesController(ITodaysGamesService todaysGamesService)
        {
            _todaysGamesService = todaysGamesService;
        }

        public ViewResult Index()
        {
            return View("Index");
        }

        public ActionResult GetPreviousGames(int daysFromToday, int sportsEventId = 1)
        {
            var date = DateTime.Now.AddDays(daysFromToday);
            if (date < new DateTime(2014, 06, 12)) return CreateJsonError("VM har ikke startet");

            var gamesForDay = _todaysGamesService.GetPreviousGames(date, sportsEventId);
            return ToJsonResult(gamesForDay);
        }

        public ActionResult GetNextGames(int daysFromToday, int sportsEventId = 1)
        {
            var date = DateTime.Now.AddDays(daysFromToday);
            if (date > new DateTime(2014, 07, 14)) return CreateJsonError("VM er over!");

            var gamesForDay = _todaysGamesService.GetNextGames(date, sportsEventId);
            return ToJsonResult(gamesForDay);
        }
    }
}