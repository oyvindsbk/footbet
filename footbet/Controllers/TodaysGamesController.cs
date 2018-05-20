using System;
using System.Web.Mvc;
using Footbet.Helpers;
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
            var gamesForDay = _todaysGamesService.GetPreviousGames(date, sportsEventId);
            return ToJsonResult(gamesForDay);
        }

        public ActionResult GetNextGames(int daysFromToday, int sportsEventId = 1)
        {
            var date = DateTime.Now.AddDays(daysFromToday);
            if (date > EventHelpers.EventEnd)
                return CreateJsonError("VM er over!");
            if (date < EventHelpers.EventStart)
                date = EventHelpers.EventStart;
            var gamesForDay = _todaysGamesService.GetNextGames(date, sportsEventId);
            if (date == EventHelpers.EventStart)
            {
                gamesForDay.IsFirstDay = true;
                gamesForDay.NumberOfDaysFromToday = (int)(EventHelpers.EventStart - DateTime.Now).TotalDays + 1;
            }
            return ToJsonResult(gamesForDay);
        }
    }
}