﻿using System;
using System.Data.Entity;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Footbet.CastleWindsor;
using Footbet.CastleWindsor.Web;
using Footbet.Data;

namespace Footbet
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            Bootstrapper
                    .CreateAndConfigure()
                    .InitializeWebApiInfrastructure();

            //Database.SetInitializer(new InitializeUserDb());
            Database.SetInitializer<FootBetDbContext>(null);

        }

        protected void Application_End(object sender, EventArgs e)
        {
            Bootstrapper.Dispose();
        }
    }
}