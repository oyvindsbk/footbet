using System;
using System.Collections.Generic;
using System.Linq;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;
using Footbet.Services.Contracts;

namespace Footbet.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _gameRepository;

        public GameService(IGameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }

        public  IEnumerable<Game> GetGamesForDateOrFollowingDateIfNoGamesOnThisDate(int sportsEventId, DateTime date, bool getNextDates, out int numberOfDaysFromToday)
        {
            IList<Game> todaysGames = null;

            for (numberOfDaysFromToday = 0; numberOfDaysFromToday < 4; numberOfDaysFromToday++)
            {
                todaysGames = _gameRepository.GetGamesForDay(date, sportsEventId);
                if (todaysGames.Count() != 0) break;
                date = getNextDates ? date.AddDays(1) : date.AddDays(-1);
            }

            return todaysGames;
        }
    }
}