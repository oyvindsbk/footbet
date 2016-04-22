using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IGroupRepository
    {
        IList<Group> GetGroupsBySportsEventId(int sportsEventId);
    }
}
