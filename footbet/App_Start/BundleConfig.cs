using System.Web.Optimization;

namespace Footbet
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.min.css",
                "~/Content/site.css",
                "~/Content/navbars.css",
                "~/Content/bootstrap-responsive.min.css",
                "~/content/soccertable.css",
                "~/content/flags.css",
                "~/content/fontawesome/font-awesome.min.css",
                "~/Content/toaster.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}