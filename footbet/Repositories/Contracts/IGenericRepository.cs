using System;
using System.Linq;
using System.Linq.Expressions;

namespace Footbet.Repositories.Contracts
{
    public interface IGenericRepository <T>
    {
        IQueryable<T> GetAll();
        IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
        void Add(T entity);
        void Delete(T entity);
        void Edit(T originalEntity, T newEntity);
        void Save();
    }
}