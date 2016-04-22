using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Footbet.Services;
using Footbet.Services.Contracts;

namespace Footbet.CastleWindsor.Installers
{
    public class ServiceInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container
                .Register(Component.For<IGameService>().ImplementedBy<GameService>())
               .Register(Component.For<ITodaysGamesService>().ImplementedBy<TodaysGamesService>());
        }
    }
}