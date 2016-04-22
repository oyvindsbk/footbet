using Microsoft.AspNet.Identity.EntityFramework;

namespace Footbet.Models.DomainModels
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }

}