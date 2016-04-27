using System.Web.Http;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace Footbet.Controllers
{
    public class Common : Controller
    {
        public string GetUserId()
        {
            return User.Identity.GetUserId();
        }

        public ActionResult CreateJsonError(string message)
        {
            var error = new HttpError { ExceptionMessage = message };
            return Json(error);
        }

        protected ActionResult ToJsonResult(object data)
        {
            return Json
               (
                   data,
                   JsonRequestBehavior.AllowGet
               );
        }
    }
}