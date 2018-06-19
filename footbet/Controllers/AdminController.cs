using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Footbet.Data;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Footbet.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController :Controller
    {
        public UserManager<ApplicationUser> UserManager { get; }
        private readonly IUserRepository _userRepository;
        public AdminController(LeagueController leagueController, IUserRepository userRepository)
            : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new FootBetDbContext())), userRepository)
        {
        }

        public AdminController(UserManager<ApplicationUser> userManager, IUserRepository userRepository)
        {
            UserManager = userManager;
            this._userRepository = userRepository;
        }

        public ViewResult ChangeUserPassword()
        {
            return View("ChangeUserPassword");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangeUserPassword(AdminChangePasswordViewModel usermodel)
        {
            var userId = _userRepository.GetUserByUserName(usermodel.UserName).Id;
            ApplicationUser user = await UserManager.FindByIdAsync(userId);
           
            user.PasswordHash = UserManager.PasswordHasher.HashPassword(usermodel.NewPassword);
            var result = await UserManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                //throw exception......
            }
            return View(usermodel);
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

    }
}