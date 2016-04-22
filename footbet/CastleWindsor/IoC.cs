using System;
using Castle.Windsor;

namespace Footbet.CastleWindsor
{
    public static class IoC
    {
        /// <summary>
        /// Initializes the specified container.
        /// </summary>
        /// <param name="container">The container.</param>
        public static void Initialize(IWindsorContainer container)
        {
            _container = container;
        }

        /// <summary>
        /// Resolves this instance.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T Resolve<T>()
        {
            return Container.Resolve<T>();
        }

        /// <summary>
        /// Resolves the specified key.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key">The key.</param>
        /// <returns></returns>
        public static T Resolve<T>(string key)
        {
            return Container.Resolve<T>(key);
        }

        /// <summary>
        /// Resolve all valid components that match this type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T[] ResolveAll<T>()
        {
            return Container.ResolveAll<T>();
        }

        public static void Dispose()
        {
            if (Container != null)
            {
                Container.Dispose();
            }
        }

        private static IWindsorContainer Container
        {
            get
            {
                if (_container == null)
                    throw new InvalidOperationException("The container has not been initialized! Please call IoC.Initialize(container) before using it.");
                return _container;
            }
        }

        private static IWindsorContainer _container;
    }
}