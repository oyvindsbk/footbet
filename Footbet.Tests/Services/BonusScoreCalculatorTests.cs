using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Footbet.Models.DomainModels;
using Footbet.ScoreCalculations;
using NUnit.Framework;

namespace Footbet.Tests.Services
{
    [TestFixture]
    public class BonusScoreCalculatorTests
    {
        private const string UserOne = "user1";
        private const string UserTwo = "user2";
        private readonly BonusScoreCalculator _bonusScoreCalculator = new BonusScoreCalculator();

        [Test]
        public void OneUserCorrect_ShouldSetBonus()
        {
            var userScores = new List<UserScore> {GetUserScoreMock(UserOne), GetUserScoreMock(UserTwo)};
            var gameIdsToUsersWithMaxScore = new Dictionary<int, List<string>>();
            gameIdsToUsersWithMaxScore.Add(48, new List<string>{UserOne});
            var result = _bonusScoreCalculator.GetBonusScoresPerUser(userScores, 2, gameIdsToUsersWithMaxScore);
            Assert.AreEqual(2, result.FirstOrDefault(x => x.Key == UserOne).Value);
            Assert.AreEqual(0, result.FirstOrDefault(x => x.Key == UserTwo).Value);
        }

        [Test]
        public void TwoUsersCorrect_ShouldNotSetBonus()
        {
            var userScores = new List<UserScore> { GetUserScoreMock(UserOne), GetUserScoreMock(UserTwo) };
            var gameIdsToUsersWithMaxScore = new Dictionary<int, List<string>>();
            gameIdsToUsersWithMaxScore.Add(48, new List<string> { UserOne, UserTwo });
            var result = _bonusScoreCalculator.GetBonusScoresPerUser(userScores, 2, gameIdsToUsersWithMaxScore);
            Assert.AreEqual(0, result.FirstOrDefault(x => x.Key == UserOne).Value);
            Assert.AreEqual(0, result.FirstOrDefault(x => x.Key == UserTwo).Value);
        }

        [Test]
        public void TwoUsersCorrectAndManyUsers_ShouldSetBonus()
        {
            var userScores = new List<UserScore> { GetUserScoreMock(UserOne), GetUserScoreMock(UserTwo) };
            var gameIdsToUsersWithMaxScore = new Dictionary<int, List<string>>();
            gameIdsToUsersWithMaxScore.Add(48, new List<string> { UserOne, UserTwo });
            var result = _bonusScoreCalculator.GetBonusScoresPerUser(userScores, 40, gameIdsToUsersWithMaxScore);
            Assert.AreEqual(2, result.FirstOrDefault(x => x.Key == UserOne).Value);
            Assert.AreEqual(2, result.FirstOrDefault(x => x.Key == UserTwo).Value);
        }

        [Test]
        public void UserCorrectInTwoGames_ShouldSetAndAddBonus()
        {
            var userScores = new List<UserScore> { GetUserScoreMock(UserOne), GetUserScoreMock(UserTwo) };
            var gameIdsToUsersWithMaxScore = new Dictionary<int, List<string>>();
            gameIdsToUsersWithMaxScore.Add(48, new List<string> { UserOne });
            gameIdsToUsersWithMaxScore.Add(49, new List<string> { UserOne });
            var result = _bonusScoreCalculator.GetBonusScoresPerUser(userScores, 2, gameIdsToUsersWithMaxScore);
            Assert.AreEqual(4, result.FirstOrDefault(x => x.Key == UserOne).Value);
            Assert.AreEqual(0, result.FirstOrDefault(x => x.Key == UserTwo).Value);
        }

        [Test]
        public void UserCorrectInTwoGamesAndOtherUserCorrectInOne_ShouldBonusAndNotAdd()
        {
            var userScores = new List<UserScore> { GetUserScoreMock(UserOne), GetUserScoreMock(UserTwo) };
            var gameIdsToUsersWithMaxScore = new Dictionary<int, List<string>>();
            gameIdsToUsersWithMaxScore.Add(48, new List<string> { UserOne, UserTwo});
            gameIdsToUsersWithMaxScore.Add(49, new List<string> { UserOne });
            var result = _bonusScoreCalculator.GetBonusScoresPerUser(userScores, 2, gameIdsToUsersWithMaxScore);
            Assert.AreEqual(2, result.FirstOrDefault(x => x.Key == UserOne).Value);
            Assert.AreEqual(0, result.FirstOrDefault(x => x.Key == UserTwo).Value);
        }

        private UserScore GetUserScoreMock(string userId)
        {
            return new UserScore
            {
                UserId = userId,
                BonusScore = 0
            };
        }
    }
}
