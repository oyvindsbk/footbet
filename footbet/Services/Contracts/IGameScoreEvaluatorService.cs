using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Services.Contracts
{
    public interface IGameScoreEvaluatorService
    {
        int GetScoreForUserOnGame(Bet referenceBet, Bet currentBet, Game currentGame, List<ScoreBasis> scoreBasises);
    }
}