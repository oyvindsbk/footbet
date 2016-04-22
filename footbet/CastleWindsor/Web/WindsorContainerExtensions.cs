using System.Web.Http;
using System.Web.Http.Dispatcher;
using System.Web.Mvc;
using Castle.Windsor;

namespace Footbet.CastleWindsor.Web
{
    public static class WindsorContainerExtensions
    {
        public static IWindsorContainer InitializeWebApiInfrastructure(this IWindsorContainer self)
        {
            var controllerFactory = new WindsorControllerFactory(self.Kernel);
            ControllerBuilder.Current.SetControllerFactory(controllerFactory);

            GlobalConfiguration.Configuration.Services.Replace(typeof(IHttpControllerActivator), new WindsorCompositionRoot(self));

            return self;
        }
    }
}