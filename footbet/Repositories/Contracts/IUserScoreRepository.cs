using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IUserScoreRepository
    {
        void AddUserScore(UserScore userScore);
        void SaveOrUpdateUserScores(List<UserScore> userScores);
        List<UserScore> GetAllUserScoresBySportsEventId(int sportsEventId);
    }
}