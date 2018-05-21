using System;
using System.Web.Mvc;
using Footbet.Helpers;
using Footbet.Models;
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
            var date = GetDateToFindGames(daysFromToday);

            var gamesForDay = _todaysGamesService.GetPreviousGames(date, sportsEventId);

            if (date == EventHelpers.EventStart)
            {
                gamesForDay.IsFirstDay = true;
            }

            return ToJsonResult(gamesForDay);
        }

        public ActionResult GetNextGames(int daysFromToday, int sportsEventId = 1)
        {
            var date = GetDateToFindGames(daysFromToday);

            if (date > EventHelpers.EventEnd)
                return CreateJsonError("VM er over!");

            var gamesForDay = _todaysGamesService.GetNextGames(date, sportsEventId);

            if (date == EventHelpers.EventStart)
            {
                gamesForDay.IsFirstDay = true;
                gamesForDay.NumberOfDaysFromToday = (int)(EventHelpers.EventStart - DateTime.Today).TotalDays;
            }
            return ToJsonResult(gamesForDay);
        }

      
        private static DateTime GetDateToFindGames(int daysFromToday)
        {
            var date = DateTime.Today.AddDays(daysFromToday);

            if (date < EventHelpers.EventStart)
                date = EventHelpers.EventStart;

            if (date > EventHelpers.EventEnd)
                date = EventHelpers.EventEnd;
            return date;
        }
    }
}