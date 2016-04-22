using System;
using System.Data.Entity;
using System.Linq;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class GenericRepository<T> :IGenericRepository<T>
        where T : class
    {

        private readonly DbContext _context;

        public GenericRepository(IUnitOfWork uow)
        {
            _context = uow.Context;
        }

        public virtual IQueryable<T> GetAll()
        {

            IQueryable<T> query = _context.Set<T>();
            return query;
        }

        public IQueryable<T> FindBy(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            IQueryable<T> query = _context.Set<T>().Where(predicate);
            return query;
        }

        public virtual void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public virtual void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public virtual void Edit(T originalEntity, T newEntity)
        {
            _context.Entry(originalEntity).CurrentValues.SetValues(newEntity);
        }

        public virtual void Save()
        {
            _context.SaveChanges();
        }
    }
}