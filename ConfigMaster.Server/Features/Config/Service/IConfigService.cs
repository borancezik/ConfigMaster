using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;

namespace ConfigMaster.Server.Features.Config.Service;

public interface IConfigService
{
    Task<ApiResponse<ConfigEntity>> GetByIdAsync(long id);
    Task<ApiResponse<ConfigEntity>> AddAsync(ConfigEntity entity);
    Task<ApiResponse<ConfigEntity>> UpdateAsync(ConfigEntity entity);
    Task<List<ConfigEntity>> GetByApplicationId(int applicationId);
}
