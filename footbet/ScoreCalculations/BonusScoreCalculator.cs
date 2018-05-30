using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Footbet.Models.DomainModels;
using WebGrease.Css.Extensions;

namespace Footbet.ScoreCalculations
{
    public class BonusScoreCalculator : IBonusScoreCalculator
    {
        private const int BonusScoreBasis = 2;

        public List<KeyValuePair<string, int>> GetBonusScoresPerUser(
            List<UserScore> userScores, int numberOfUserBets, Dictionary<int, List<string>> gameIdsToUsersWithMaxScore)
        {
            var bonusPointsPerUser = new List<KeyValuePair<string, int>>();
            foreach (var gameIdToUsers in gameIdsToUsersWithMaxScore)
            {
                var userIds = gameIdToUsers.Value;
                var numberOfMaxScores = userIds.Count;

                if (numberOfUserBets == 0 || numberOfMaxScores == 0)
                    break;

                if (numberOfMaxScores == 1)
                {
                    var userId = userIds.Single();

                    UpdateBonusPointsPerUser(bonusPointsPerUser, userId);
                    continue;
                }

                double percentOfTotalUsers = (double) numberOfMaxScores / numberOfUserBets;
                if (percentOfTotalUsers <= 0.05)
                {
                    foreach (var userId in userIds)
                    {
                        UpdateBonusPointsPerUser(bonusPointsPerUser, userId);
                    }
                }
            }

            return bonusPointsPerUser;
        }

        private static void UpdateBonusPointsPerUser(List<KeyValuePair<string, int>> bonusPointsPerUser, string userId)
        {
            var oldEntry = bonusPointsPerUser.FirstOrDefault(x => x.Key == userId);
            if (oldEntry.Key == null)
            {
                oldEntry = new KeyValuePair<string, int>(userId, BonusScoreBasis);
                bonusPointsPerUser.Add(oldEntry);
            }
            else
            {
                var newEntry = new KeyValuePair<string, int>(oldEntry.Key, oldEntry.Value + BonusScoreBasis);
                bonusPointsPerUser.Remove(oldEntry);
                bonusPointsPerUser.Add(newEntry);
            }
        }
    }
}