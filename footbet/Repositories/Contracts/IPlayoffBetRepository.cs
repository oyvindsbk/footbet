using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IPlayoffBetRepository
    {
        void SaveOrUpdatePlayoffBets(IList<PlayoffBet> playoffBets, int userBetId);
    }
}