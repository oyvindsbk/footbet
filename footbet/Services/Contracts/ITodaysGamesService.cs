using System;
using Footbet.Models;

namespace Footbet.Services.Contracts
{
    public interface ITodaysGamesService
    {
        TodaysGamesViewModel GetNextGames(DateTime date, int sportsEventId);
        TodaysGamesViewModel GetPreviousGames(DateTime date, int sportsEventId);
    }
}