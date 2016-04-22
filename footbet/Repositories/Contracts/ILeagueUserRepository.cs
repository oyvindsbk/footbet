using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface ILeagueUserRepository
    {
        List<LeagueUser> GetLeagueUsersByUserId(string userId);
        List<LeagueUser> GetLeagueUsersByLeagueId(int leagueId);
        void AddUserToLeague(LeagueUser leagueUser);
        bool UserIsAlreadyInLeague(LeagueUser leagueUser);
    }
}