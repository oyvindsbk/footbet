using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IUserBetRepository
    {
        int SaveOrUpdateUserBet(UserBet userBet);
        UserBet GetUserBetByUserId(string userId);
        UserBet GetUserBetById(int userBetId);
        List<UserBet> GetAllUserBetsBySportsEventIdWithoutResultBet(int sportsEventId);
    }
}