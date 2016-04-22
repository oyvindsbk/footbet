using System.Web.Mvc;
using Castle.Core;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Footbet.Controllers;

namespace Footbet.CastleWindsor.Installers
{
    public class ControllersInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Classes.FromAssemblyContaining<BetController>()
                .BasedOn<Controller>()
                .Configure(c => c.LifeStyle.Is(LifestyleType.Transient)));
            container.Register(Classes.FromAssemblyContaining<ResultController>()
               .BasedOn<Controller>()
               .Configure(c => c.LifeStyle.Is(LifestyleType.Transient)));
        }
    }
}