using System.Collections.Generic;
using System.Linq;
using Footbet.Models;
using Footbet.Models.DomainModels;

namespace Footbet.Helpers
{
    public class BetMappers
    {
        public static void SetValuesFromExistingBets(List<GameViewModel> games, UserBet userBet)
        {
            foreach (var game in games)
            {
                if (userBet.Bets != null)
                    SetValuesFromBetIfExists(userBet.Bets, game);
            }
        }

        
        private static void SetValuesFromBetIfExists(IEnumerable<Bet> bets, GameViewModel gameViewModel)
        {
            var matchingBet = bets.SingleOrDefault(x => x.GameId == gameViewModel.Id);

            if (matchingBet == null) return;

            gameViewModel.HomeGoals = matchingBet.HomeGoals;
            gameViewModel.AwayGoals = matchingBet.AwayGoals;
            gameViewModel.Result = matchingBet.Result;
        }

        public static PlayoffBet MapPlayoffGamesResultViewModelToPlayoffBets(PlayoffBetViewModel playoffBetViewModel, int userBetId)
        {
            int? homeTeam = null;
            int? awayTeam = null;

            if (playoffBetViewModel.HomeTeam != null) homeTeam = playoffBetViewModel.HomeTeam.Id;
            if (playoffBetViewModel.AwayTeam != null) awayTeam = playoffBetViewModel.AwayTeam.Id;

            return new PlayoffBet
            {
                HomeTeam = homeTeam,
                AwayTeam = awayTeam,
                HomeGoals = playoffBetViewModel.HomeGoals,
                AwayGoals = playoffBetViewModel.AwayGoals,
                GameId = playoffBetViewModel.Id,
                GameType = playoffBetViewModel.GameType,
                Result = GetGameResult(playoffBetViewModel.HomeGoals, playoffBetViewModel.AwayGoals),
                UserBetId = userBetId
            };
        }

        public static Bet MapGameResultViewModelToBet(GameResultViewModel gameResultViewModel, int userBetId)
        {
            return new Bet
            {
                HomeGoals = gameResultViewModel.HomeGoals,
                AwayGoals = gameResultViewModel.AwayGoals,
                Result = GetGameResult(gameResultViewModel.HomeGoals, gameResultViewModel.AwayGoals),
                GameId = gameResultViewModel.Id,
                UserBetId = userBetId
            };
        }

        private static int GetGameResult(int? homeGoals, int? awayGoals)
        {
            if (homeGoals > awayGoals)
                return 0;
            if (homeGoals < awayGoals)
                return 2;

            return 1;
        }

    }
}