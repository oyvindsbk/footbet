using System;
using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Services.Contracts
{
    public interface IGameService
    {
        IEnumerable<Game> GetGamesForDateOrFollowingDateIfNoGamesOnThisDate(int sportsEventId, DateTime date, bool getNextDates, out int numberOfDaysFromToday);
    }
}