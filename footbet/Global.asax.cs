using System;
using System.Data.Entity;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Footbet.CastleWindsor;
using Footbet.CastleWindsor.Web;
using Footbet.Data;
using Newtonsoft.Json.Serialization;
using System.Web.Http;

namespace Footbet
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            Bootstrapper
                    .CreateAndConfigure()
                    .InitializeWebApiInfrastructure();
            Database.SetInitializer(new InitializeUserDb());
            
            Database.SetInitializer<FootBetDbContext>(null);

        }

        protected void Application_End(object sender, EventArgs e)
        {
            Bootstrapper.Dispose();
        }
    }
}
