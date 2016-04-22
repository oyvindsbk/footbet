using System;
using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IGameRepository
    {
        void UpdateHomeAndAwayTeamOnGame(int homeTeamId, int awayTeamId, int gameId);
        IList<Game> GetPlayOffGamesBySportsEventId(int sportsEventId);
        IList<Game> GetGroupGamesBySportsEventId(int sportsEventId);
        IList<Game> GetAllGamesBySportsEventId(int sportsEventId);
        IList<Game> GetGamesForDay(DateTime day, int sportsEventId);

    }
}