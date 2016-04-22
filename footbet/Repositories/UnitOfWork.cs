using System;
using System.Data.Entity;
using Footbet.Data;

namespace Footbet.Repositories
{
    public interface IUnitOfWork
    {
        void SaveChanges();
        DbContext Context { get; }
    }

    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly DbContext _context;
        private bool _disposed = false;

        public UnitOfWork(IDbContextFactory contextFactory)
        {
            _context = contextFactory.GetContext();
        }

        public void SaveChanges()
        {
            if (_context != null)
            {
                _context.SaveChanges();
            }
        }

        public DbContext Context
        {
            get { return _context; }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }

    public interface IDbContextFactory
    {
        DbContext GetContext();
    }

    public class DbContextFactory : IDbContextFactory
    {
        private readonly DbContext _context;

        public DbContextFactory()
        {
            _context = new FootBetDbContext();
        }

        public DbContext GetContext()
        {
            return _context;
        }
    }
}