using System.Collections.Generic;
using System.Linq;
using Footbet.Models.DomainModels;
using Footbet.Models.Enums;

namespace Footbet.Controllers.Helpers
{
    public interface IGameScoreEvaluator
    {
        int GetScoreForUserOnGame(Bet referenceBet, Bet currentBet, Game currentGame, List<ScoreBasis> scoreBasises);
    }

    public  class GameScoreEvaluator : IGameScoreEvaluator
    {
        public int GetScoreForUserOnGame(Bet referenceBet, Bet currentBet, Game currentGame, List<ScoreBasis> scoreBasises)
        {
            var gameType = currentGame.GameType;
            var gradeOfMatch = EvaluateGradeOfMatchBetweenResultAndBet(referenceBet, currentBet, gameType);

            var scoreBasis = scoreBasises.SingleOrDefault(x => x.GameType == gameType && x.GradeOfMatchType == gradeOfMatch);

            return scoreBasis != null ? scoreBasis.Points : 0;
        }

        private int EvaluateGradeOfMatchBetweenResultAndBet(Bet referenceBet, Bet usersBet, int gameType)
        {
            if (gameType > 1)
            {
                if (ResultMatch(referenceBet, usersBet))
                {
                    return (int)GradeOfMatchType.ExactResult;
                }
                return (int)GradeOfMatchType.None;
            }
            if (HomeOrAwayGoalsMatch(referenceBet, usersBet) && !ResultMatch(referenceBet, usersBet))
            {
                return (int)GradeOfMatchType.HomeOrAwayGoalsMatch;
            }

            if (HomeOrAwayGoalsMatch(referenceBet, usersBet) && ResultMatch(referenceBet, usersBet))
            {
                return (int)GradeOfMatchType.HomeGoalsOrAwayGoalsMatchAndResultIsCorrect;
            }

            if (ResultMatch(referenceBet, usersBet) && !HomeGoalsMatch(referenceBet, usersBet) && !AwayGoalsMatch(referenceBet, usersBet))
            {
                return (int)GradeOfMatchType.OnlyResultIsCorrect;
            }

            if (HomeGoalsMatch(referenceBet, usersBet) && AwayGoalsMatch(referenceBet, usersBet) &&
                ResultMatch(referenceBet, usersBet))
            {
                return (int)GradeOfMatchType.ExactResult;
            }

            return (int)GradeOfMatchType.None;
        }

        private static bool ResultMatch(Bet referenceBet, Bet usersBet)
        {
            return referenceBet.Result == usersBet.Result;
        }

        private static bool HomeOrAwayGoalsMatch(Bet referenceBet, Bet usersBet)
        {
            return (HomeGoalsMatch(referenceBet, usersBet) && !AwayGoalsMatch(referenceBet, usersBet)) ||
                   (!HomeGoalsMatch(referenceBet, usersBet) && AwayGoalsMatch(referenceBet, usersBet));
        }

        private static bool AwayGoalsMatch(Bet referenceBet, Bet usersBet)
        {
            return referenceBet.AwayGoals == usersBet.AwayGoals;
        }

        private static bool HomeGoalsMatch(Bet referenceBet, Bet usersBet)
        {
            return referenceBet.HomeGoals == usersBet.HomeGoals;
        }

    }
}