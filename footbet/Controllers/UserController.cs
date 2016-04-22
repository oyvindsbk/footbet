using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Controllers
{
    [Authorize]
    public class UserController : Common
    {
        private readonly IUserRepository _userRepository;
        //TODO:CAN BE DELETED?
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public ActionResult GetUsers(int sportsEventId = 1)
        {
            var users = _userRepository.GetAllApplicationUsers();
            var userViewModels = MapUsersToUserViewModels(users);
            return ToJsonResult(userViewModels);
        }

        private List<UserViewModel> MapUsersToUserViewModels(IEnumerable<ApplicationUser> users)
        {
            return users.Select(MapUserToUserViewModel).ToList();
        }

        private static UserViewModel MapUserToUserViewModel(ApplicationUser applicationUser)
        {
            var userViewModel = new UserViewModel
            {
                Name = applicationUser.Name,
                UserName = applicationUser.UserName
            };
            return userViewModel;
        }
    }
}