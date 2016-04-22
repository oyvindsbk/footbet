using System.Web.Mvc;

namespace Footbet.Controllers
{
    [Authorize]
    public class UserBetController : Common
    {
        public ActionResult Index()
        {
            return View("UserBet");
        }

    }
}
