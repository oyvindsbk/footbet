﻿using System.Web.Script.Serialization;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Footbet.Controllers.Helpers;

namespace Footbet.CastleWindsor.Installers
{
    public class AdditionalInstallers : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container
                .Register(Component.For<JavaScriptSerializer>().ImplementedBy<JavaScriptSerializer>())
                .Register(Component.For<IGameScoreEvaluator>().ImplementedBy<GameScoreEvaluator>());
        }
    }
}