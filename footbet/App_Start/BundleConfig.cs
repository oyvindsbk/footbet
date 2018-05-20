using System.Web;
using System.Web.Optimization;

namespace Footbet
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
           

            bundles.Add(new StyleBundle("~/Content/css").Include(
                     "~/Content/bootstrap.min.css",
                     "~/Content/site.css",
                     "~/Content/navbars.css",
                     "~/Content/bootstrap-responsive.min.css",
                     "~/content/soccertable.css",
                        "~/content/flags.css"));


            

            BundleTable.EnableOptimizations = true;
        }
    }
}
