using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IResultRepository
    {
        void SaveOrUpdateResult(Results result);
        Results GetResultBySportsEventId(int sportsEventId);
    }
}