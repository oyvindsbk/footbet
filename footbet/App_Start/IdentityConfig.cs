using System.Data.Entity;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Footbet
{
    public class InitializeUserDb : DropCreateDatabaseAlways<FootBetDbContext>
    {
        protected override void Seed(FootBetDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }

        private void InitializeIdentityForEF(FootBetDbContext context)
        {
            //var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            //var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            //const string adminRole = "Admin";
            //const string userRole = "Users";

            //if (!roleManager.RoleExists(adminRole))
            //{
            //    roleManager.Create(new IdentityRole(adminRole));
            //}

            //if (!roleManager.RoleExists(userRole))
            //{
            //    roleManager.Create(new IdentityRole(userRole));
            //}

            //var user = new ApplicationUser
            //{
            //    UserName = "AdminEporkg"
            //};

            //var adminresult = userManager.Create(user, "Syrlig 1 svak sterk");

            //if (adminresult.Succeeded)
            //{
            //    userManager.AddToRole(user.Id, adminRole);
            //}
        }
    }
}