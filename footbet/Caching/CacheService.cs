using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Caching;
using System.Threading.Tasks;

namespace Footbet.Caching
{

    public class InMemoryCache : ICacheService
    {

        public T GetOrSet<T>(string cacheKey, Func<T> getItemCallback) where T : class
        {
            if (MemoryCache.Default.Get(cacheKey) is T item)
                return item;
            item = getItemCallback();
            MemoryCache.Default.Add(cacheKey, item, DateTime.UtcNow.AddHours(24));
            return item;
        }

        public void ClearAll()
        {
            var allKeys = MemoryCache.Default.Select(o => o.Key);
            Parallel.ForEach(allKeys, key => MemoryCache.Default.Remove(key));
        }

        public void Remove(string cacheKey)
        {
            MemoryCache.Default.Remove(cacheKey);
        }
    }

    public interface ICacheService
    {
        T GetOrSet<T>(string cacheKey, Func<T> getItemCallback) where T : class;
        void Remove(string cacheKey);
        void ClearAll();
    }
}