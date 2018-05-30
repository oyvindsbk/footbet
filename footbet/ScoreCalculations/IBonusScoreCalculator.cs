using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.ScoreCalculations
{
    public interface IBonusScoreCalculator
    {
        List<KeyValuePair<string, int>> GetBonusScoresPerUser(List<UserScore> userScores, int numberOfUserBets, Dictionary<int, List<string>> gameIdsToUsersWithMaxScore);
    }
}