using System.Collections.Generic;
using System.Linq;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class ScoreBasisRepository : IScoreBasisRepository
    {
        private readonly IGenericRepository<ScoreBasis> _repository;

        public ScoreBasisRepository(IGenericRepository<ScoreBasis> repository)
        {
            _repository = repository;
        }

        public List<ScoreBasis> GetScoreBasisesBySportsEventId(int sportsEventId)
        {
            return _repository.FindBy(x => x.SportsEventId == sportsEventId).ToList();
        }
    }
}