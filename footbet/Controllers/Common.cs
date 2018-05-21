using System.Web.Http;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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
            var serializedData = JsonConvert.SerializeObject(data, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            return Content(serializedData, "application/json");
 
        }
    }
}