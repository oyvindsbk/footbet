using Footbet.Models.DomainModels;

namespace Footbet.Services.Contracts
{
    public interface IUserScoreService
    {
        string UpdateUserScores(UserBet referenceUserBet, int sportsEventId = 1);
    }
}