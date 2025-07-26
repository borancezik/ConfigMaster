using ConfigMaster.Server.Features.Config.Domain;
using System.Linq.Expressions;

namespace ConfigMaster.Server.Features.Config.Data;

public interface IConfigRepository
{
    Task<ConfigEntity> GetByIdAsync(long id);
    Task<ConfigEntity> AddAsync(ConfigEntity entity);
    Task<ConfigEntity> Update(ConfigEntity entity);
    Task<List<ConfigEntity>> GetByApplicationId(int applicationId);
    Task<ConfigEntity> GetByFilter(Expression<Func<ConfigEntity, bool>> filterExpression);
}
