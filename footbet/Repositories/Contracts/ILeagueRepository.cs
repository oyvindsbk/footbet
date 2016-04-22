using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface ILeagueRepository
    {
        League AddNewLeague(League league);
        bool DoesLeagueExist(string leagueName);
        List<League> GetLeaguesForUser(string userId, int sportsEventId, List<LeagueUser> leagueUsers);
        League GetLeagueByGuid(string guid);
    }
}