using System.Collections.Generic;
using System.Linq;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class UserRepository :  IUserRepository
    {
        private readonly IGenericRepository<ApplicationUser> _repository;

        public UserRepository(IGenericRepository<ApplicationUser> repository)
        {
            _repository = repository;
        }

        public List<ApplicationUser> GetAllApplicationUsers()
        {
             var allUsers =_repository.GetAll().ToList();
             return allUsers.Where(x => x.UserName != "AdminEporkg").ToList();
        }

        public ApplicationUser GetUserByUserId(string userId)
        {
            return _repository.FindBy(x => x.Id == userId).FirstOrDefault();
        }

        public ApplicationUser GetUserByUserName(string userName)
        {
            return _repository.FindBy(x => x.UserName == userName).FirstOrDefault();
        }
    }
}