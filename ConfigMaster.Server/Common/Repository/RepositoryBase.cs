using ConfigMaster.Server.Common.Models.Entity;
using ConfigMaster.Server.Common.Specification;
using ConfigMaster.Server.DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ConfigMaster.Server.Common.Repository;

public class RepositoryBase<TEntity, TContext> : IRepositoryBase<TEntity>
where TEntity : class, IEntity, new()
where TContext : ApplicationContext
{
    private readonly TContext _context;
    private readonly DbSet<TEntity> _dbSet;
    public RepositoryBase(TContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<List<TEntity>> GetAll(int queryPage, int querySize)
    {
        return _dbSet.Skip((queryPage - 1) * querySize).Take(querySize).ToList();
    }

    public virtual async Task<TEntity> GetByFilter(Specification<TEntity> specification)
    {
        return await _dbSet.Where(specification.Expression()).FirstOrDefaultAsync();
    }

    public virtual async Task<TEntity> GetByIdAsync(long id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<TEntity> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> filter)
    {
        return await _dbSet.FirstOrDefaultAsync(filter);
    }

    public virtual async Task<TEntity> Update(TEntity entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}
