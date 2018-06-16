using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Footbet.Models.DomainModels;
using Footbet.Models.Enums;

namespace Footbet.ScoreCalculations
{
    public class TopScorerScoreCalculator : ITopScorerScoreCalculator
    {
        public int Calculate(UserBet referenceUserBet, UserBet usersBet, List<ScoreBasis> scoreBases)
        {
            var referenceTopScorerName = referenceUserBet.TopScorerName;
            var referenceTopScorerTeam = referenceUserBet.TopScorerTeam;
            var scoreBasisTopScorer = scoreBases.FirstOrDefault(x => x.GameType == (int) GameType.TopScorer);
            if (scoreBasisTopScorer == null)
                return 0;
            if (string.IsNullOrEmpty(referenceTopScorerName))
                return 0;
            return referenceTopScorerName == usersBet.TopScorerName &&
                   referenceTopScorerTeam == usersBet.TopScorerTeam
                ? scoreBasisTopScorer.Points : 0;
        }
    }

    public interface ITopScorerScoreCalculator
    {
        int Calculate(UserBet referenceUserBet, UserBet usersBet, List<ScoreBasis> scoreBases);
    }
}