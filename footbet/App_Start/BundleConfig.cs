using System.Web;
using System.Web.Optimization;

namespace Footbet
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
           // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
//            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
//                        "~/Scripts/libs/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/libs/bootstrap.js",
                      "~/Scripts/libs/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                     "~/Content/bootstrap.min.css",
                     "~/Content/site.css",
                     "~/Content/navbars.css",
                     "~/Content/bootstrap-responsive.min.css",
                     "~/content/soccertable.css",
                        "~/content/flags.css"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/libs/jquery/jquery-2.0.3.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                       "~/Scripts/libs/angular/angular.min.js",
                       "~/Scripts/libs/angular-ui-bootstrap/ui-bootstrap-0.7.0.min.js",
                       "~/Scripts/libs/angular-ui-bootstrap/ui-bootstrap-tpls-0.7.0.min.js",
      
                       "~/Scripts/app.js",
                       "~/Scripts/libs/angular/i18n/angular-locale_no.js"));

            bundles.Add(new ScriptBundle("~/scriptbundles/betbundle").Include(
                "~/Scripts/services/betService.js",
                "~/Scripts/directives/betDirectives.js"
                ));

            bundles.Add(new ScriptBundle("~/scriptbundles/leaguebundle").Include(
               "~/Scripts/controllers/leagueController.js",
               "~/Scripts/services/leagueService.js",
               "~/Scripts/controllers/leaderboardController.js",
               "~/Scripts/services/leaderboardService.js"
               
               ));

            bundles.Add(new ScriptBundle("~/scriptbundles/betctrl").Include(
                 "~/Scripts/controllers/betController.js"
                ));
            bundles.Add(new ScriptBundle("~/scriptbundles/todaysgamesbundle").Include(
                "~/Scripts/services/todaysGamesService.js",
                 "~/Scripts/controllers/todaysGamesController.js"
                ));
            bundles.Add(new ScriptBundle("~/scriptbundles/userbetctrl").Include(
                 "~/Scripts/controllers/userBetController.js"
                ));

            bundles.Add(new ScriptBundle("~/scriptbundles/resultctrl").Include(
                "~/Scripts/controllers/betController.js",
                 "~/Scripts/controllers/resultController.js"
                ));

            bundles.Add(new ScriptBundle("~/scriptbundles/resultpagectrl").Include(
                 "~/Scripts/controllers/resultPageController.js"
                ));

            BundleTable.EnableOptimizations = true;
        }
    }
}
