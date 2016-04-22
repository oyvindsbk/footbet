using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Footbet.Startup))]
namespace Footbet
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
