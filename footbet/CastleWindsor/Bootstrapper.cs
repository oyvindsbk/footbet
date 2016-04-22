using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Footbet.CastleWindsor.Installers;

namespace Footbet.CastleWindsor
{
    public class Bootstrapper
    {
        public static IWindsorContainer CreateAndConfigure(params IWindsorInstaller[] additionalInstallers)
        {
            var container = new WindsorContainer()
                .Install(
                    new RepositoriesInstaller(),
                    new ControllersInstaller(),
                    new PersistenceInstaller(),
                    new ServiceInstaller(),
                    new AdditionalInstallers()

            );

            container.Install(additionalInstallers);

            IoC.Initialize(container);
            return container;
        }

        
        public static void Dispose()
        {
            IoC.Dispose();
        }
    }
}