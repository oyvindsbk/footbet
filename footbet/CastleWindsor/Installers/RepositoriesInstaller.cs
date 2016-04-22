using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Footbet.Repositories;
using Footbet.Repositories.Contracts;

namespace Footbet.CastleWindsor.Installers
{
    public class RepositoriesInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container
                .Register(Component.For<IUserBetRepository>().ImplementedBy<UserBetRepository>())
                .Register(Component.For<IBetRepository>().ImplementedBy<BetRepository>())
                .Register(Component.For<IGroupRepository>().ImplementedBy<GroupRepository>())
                .Register(Component.For<IResultRepository>().ImplementedBy<ResultRepository>())
                .Register(Component.For<IUserRepository>().ImplementedBy<UserRepository>())
                .Register(Component.For<IUserScoreRepository>().ImplementedBy<UserScoreRepository>())
                .Register(Component.For<IScoreBasisRepository>().ImplementedBy<ScoreBasisRepository>())
                .Register(Component.For<ILeagueUserRepository>().ImplementedBy<LeagueUserRepository>())
                .Register(Component.For<ILeagueRepository>().ImplementedBy<LeagueRepository>())
                .Register(Component.For<ITeamRepository>().ImplementedBy<TeamRepository>())
                .Register(Component.For<IPlayoffBetRepository>().ImplementedBy<PlayoffBetRepository>())
                .Register(Component.For<IGameRepository>().ImplementedBy<GameRepository>());
        }
    }
}