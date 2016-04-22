using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IBetRepository
    {
        void SaveOrUpdateBets(IList<Bet> bets, int userBetId);
    }
}