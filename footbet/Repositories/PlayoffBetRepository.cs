using System.Collections.Generic;
using System.Linq;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class PlayoffBetRepository : IPlayoffBetRepository
    {
        private readonly IGenericRepository<PlayoffBet> _repository;

        public PlayoffBetRepository(IGenericRepository<PlayoffBet> repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdatePlayoffBets(IList<PlayoffBet> playoffBets, int userBetId)
        {
            foreach (var playoffBet in playoffBets)
            {
                var original = _repository.FindBy(x => x.GameId == playoffBet.GameId && x.UserBetId == userBetId).ToList();
                if (original.Count() == 1)
                {
                    var oldEntity = original.First();
                    oldEntity.HomeTeam = playoffBet.HomeTeam;
                    oldEntity.AwayTeam = playoffBet.AwayTeam;
                    oldEntity.HomeGoals = playoffBet.HomeGoals;
                    oldEntity.AwayGoals = playoffBet.AwayGoals;
                    oldEntity.Result = playoffBet.Result;
                }
                else
                {
                    playoffBet.UserBetId = userBetId;
                    _repository.Add(playoffBet);
                }
            }
            _repository.Save();
        }
    }
}