using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IScoreBasisRepository
    {
        List<ScoreBasis> GetScoreBasisesBySportsEventId(int sportsEventId);
    }
}