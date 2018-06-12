using System;
using System.Globalization;
using System.Web.Mvc;
using Footbet.Caching;
using Footbet.Helpers;
using Footbet.Models;
using Footbet.Services.Contracts;

namespace Footbet.Controllers
{
    public class TodaysGamesController : Common
    {
        private readonly ITodaysGamesService _todaysGamesService;
        private readonly ICacheService _cacheService;

        public TodaysGamesController(
            ITodaysGamesService todaysGamesService,
            ICacheService cacheService)
        {
            _todaysGamesService = todaysGamesService;
            _cacheService = cacheService;
        }

        public ViewResult Index()
        {
            return View("Index");
        }

        public ActionResult GetNextGames(int daysFromToday, int sportsEventId = 1)
        {
            var date = GetDateToFindGames(daysFromToday);

            if (date > EventHelpers.EventEnd)
                return CreateJsonError("VM er over!");

            var gamesForDay = _cacheService.GetOrSet(GetNextGamesCacheKey(date), () => GetNextGames(sportsEventId, date));
            return ToJsonResult(gamesForDay);
        }

        public ActionResult GetPreviousGames(int daysFromToday, int sportsEventId = 1)
        {
            var date = GetDateToFindGames(daysFromToday);

            var gamesForDay = _cacheService.GetOrSet(GetPreviousGamesCacheKey(date), () => GetPreviousGames(sportsEventId, date));

            return ToJsonResult(gamesForDay);
        }

        private TodaysGamesViewModel GetNextGames(int sportsEventId, DateTime date)
        {
            var gamesForDay = _todaysGamesService.GetNextGames(date, sportsEventId);

            if (date != EventHelpers.EventStart)
                return gamesForDay;

            gamesForDay.IsFirstDay = true;
            gamesForDay.NumberOfDaysFromToday = (int)(EventHelpers.EventStart - DateTime.Today).TotalDays;

            return gamesForDay;
        }

        private TodaysGamesViewModel GetPreviousGames(int sportsEventId, DateTime date)
        {
            var gamesForDay = _todaysGamesService.GetPreviousGames(date, sportsEventId);

            if (date != EventHelpers.EventStart)
                return gamesForDay;

            gamesForDay.IsFirstDay = true;

            return gamesForDay;
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

        private static string GetNextGamesCacheKey(DateTime date)
        {
            var todaysGamesCacheKey = $"GetNextGames.{date.ToString(CultureInfo.CurrentCulture)}";
            return todaysGamesCacheKey;
        }

        private static string GetPreviousGamesCacheKey(DateTime date)
        {
            var todaysGamesCacheKey = $"GetPreviousGames.{date.ToString(CultureInfo.CurrentCulture)}";
            return todaysGamesCacheKey;
        }
    }
}