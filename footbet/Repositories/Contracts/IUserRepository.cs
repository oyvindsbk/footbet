using System.Collections.Generic;
using Footbet.Data;
using Footbet.Models.DomainModels;

namespace Footbet.Repositories.Contracts
{
    public interface IUserRepository
    {
        List<ApplicationUser> GetAllApplicationUsers();
        ApplicationUser GetUserByUserId(string userId);
        ApplicationUser GetUserByUserName(string userName);
    }
}