using ConfigMaster.Server.Features.Config.Domain;

namespace ConfigMaster.Server.Features.Config.Data;

public interface IConfigRepository
{
    Task<ConfigEntity> GetByIdAsync(long id);
    Task<ConfigEntity> AddAsync(ConfigEntity entity);
    Task<ConfigEntity> Update(ConfigEntity entity);
    Task<List<ConfigEntity>> GetByApplicationId(int applicationId);
}
