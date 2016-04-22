using System.Collections.Generic;
using System.Linq;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class BetRepository : IBetRepository
    {
        private readonly IGenericRepository<Bet> _repository;

        public BetRepository(IGenericRepository<Bet> repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdateBets(IList<Bet> bets, int userBetId)
        {
            foreach (var bet in bets)
            {
                var original = _repository.FindBy(x => x.GameId == bet.GameId && x.UserBetId == userBetId).ToList();
                if (original.Count() == 1)
                {
                    var oldEntity = original.First();
                    oldEntity.HomeGoals = bet.HomeGoals;
                    oldEntity.AwayGoals = bet.AwayGoals;
                    oldEntity.Result = bet.Result;
                }
                else
                {
                    bet.UserBetId = userBetId;
                    _repository.Add(bet);
                }
            }
            _repository.Save();
        }
    }
}