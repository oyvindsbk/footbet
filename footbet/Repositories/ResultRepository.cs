using System.Linq;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class ResultRepository : IResultRepository
    {
        private readonly IGenericRepository<Results> _repository;

        public ResultRepository(IGenericRepository<Results> repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdateResult(Results result)
        {
            var original = _repository.FindBy(x => x.UserBetId == result.UserBetId).ToList();
            if (original.Count() == 1)
            {
                return;
            }

            _repository.Add(result);
            _repository.Save();
        }

        public Results GetResultBySportsEventId(int sportsEventId)
        {
            return _repository.FindBy(x => x.SportsEventId == sportsEventId).ToList().First();
        }
    }
}