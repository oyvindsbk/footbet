using System.Data.Entity;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Footbet.Data;
using Footbet.Models;
using Footbet.Repositories;
using Footbet.Repositories.Contracts;

namespace Footbet.CastleWindsor.Installers
{
    public class PersistenceInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<DbContext>().ImplementedBy<FootBetDbContext>().LifestyleTransient());
            container.Register(Component.For<IUnitOfWork>().ImplementedBy<UnitOfWork>());
            container.Register(Component.For<IDbContextFactory>().ImplementedBy<DbContextFactory>().LifestyleTransient());
            container.Register(Component.For(typeof(IGenericRepository<>)).ImplementedBy(typeof(GenericRepository<>)).LifestyleTransient());
        }
    }
}