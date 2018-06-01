using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Footbet
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{userName}",
                defaults: new { controller = "Bet", action = "Index", userName = UrlParameter.Optional }
            );
        }
    }
}
