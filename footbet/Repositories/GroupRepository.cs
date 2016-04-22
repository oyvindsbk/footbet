using System.Collections.Generic;
using System.Linq;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly IGenericRepository<Group> _repository;

        public GroupRepository(IGenericRepository<Group> repository)
        {
            _repository = repository;
        }

        public IList<Group> GetGroupsBySportsEventId(int sportsEventId)
        {
            return _repository.FindBy(x => x.SportsEventId == sportsEventId).ToList();
        }
    }
}