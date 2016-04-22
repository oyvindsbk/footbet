using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface ITeamRepository
    {
        Team GetTeamById(int? teamId);
        List<Team> GetTeamsBySportsEventId(int sportsEventId);
    }
}