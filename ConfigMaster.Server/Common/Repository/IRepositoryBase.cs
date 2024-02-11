using ConfigMaster.Server.Common.Models.Entity;
using ConfigMaster.Server.Common.Specification;
using System.Linq.Expressions;

namespace ConfigMaster.Server.Common.Repository;

public interface IRepositoryBase<T> where T : class, IEntity, new()
{
    Task<T> GetByIdAsync(long id);
    Task<T> AddAsync(T entity);
    Task<T> Update(T entity);
    Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> filter);
    Task<List<T>> GetAll(int queryPage, int querySize);
    Task<T> GetByFilter(Specification<T> specification);
}

