using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Footbet.Controllers
{
    public class ResultPageController : Controller
    {
        private readonly BetController _betController;

        public ResultPageController(BetController betController)
        {
            _betController = betController;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetResults(int sportsEventId = 1)
        {
            return _betController.GetBasisForBet("AdminEporkg", sportsEventId);
        }
	}
}