using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Caching;

namespace Footbet.Caching
{

    public class InMemoryCache : ICacheService
    {
        private MemoryCache _cache;
        private string cacheName = "InMemoryCache";

        public InMemoryCache()
        {
            _cache = new MemoryCache(cacheName);
        }

        public T GetOrSet<T>(string cacheKey, Func<T> getItemCallback) where T : class
        {
            if (_cache.Get(cacheKey) is T item)
                return item;
            item = getItemCallback();
            _cache.Add(cacheKey, item, DateTime.UtcNow.AddHours(24));
            return item;
        }

        public void ClearCache()
        {
            var oldCache = _cache;
            _cache = new MemoryCache(cacheName);
            oldCache.Dispose();
        }

        public void Remove(string cacheKey)
        {
            _cache.Remove(cacheKey);
        }
    }

    public interface ICacheService
    {
        T GetOrSet<T>(string cacheKey, Func<T> getItemCallback) where T : class;
        void ClearCache();
        void Remove (string cacheKey);
    }
}