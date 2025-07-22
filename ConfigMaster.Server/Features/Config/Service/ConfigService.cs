using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Common.Models.Utils;
using ConfigMaster.Server.Common.Service.CacheService.Concrete;
using ConfigMaster.Server.Common.Service.SocketServerService;
using ConfigMaster.Server.Features.Config.Data;
using ConfigMaster.Server.Features.Config.Domain;
using Microsoft.AspNetCore.SignalR;

namespace ConfigMaster.Server.Features.Config.Service;

public class ConfigService : IConfigService
{
    private readonly IConfigRepository _configRepository;
    private readonly CacheService _cacheService;
    private readonly IHubContext<SocketServerService> _socketHub;
    public ConfigService(IConfigRepository configRepository, CacheService cacheService, IHubContext<SocketServerService> socketHub)
    {
        _configRepository = configRepository;
        _cacheService = cacheService;
        _socketHub = socketHub;
    }

    public async Task<ApiResponse<ConfigEntity>> AddAsync(ConfigEntity config)
    {
        var entity = await _configRepository.AddAsync(config);
        if (entity is not null)
        {
            return ApiResponse<ConfigEntity>.SuccessResult(entity);
        }
        else
        {
            return ApiResponse<ConfigEntity>.FailureResult(Constants.NotUpdated);
        }

    }

    public async Task<ApiResponse<ConfigEntity>> GetByIdAsync(long id)
    {
        string cacheKey = $"{id}";
        string hashField = $"{nameof(ConfigEntity)}";
        var configCache = await _cacheService.GetAsync<ConfigEntity>(cacheKey, hashField);

        if (configCache is not null)
            return ApiResponse<ConfigEntity>.SuccessResult(configCache);

        var configEntity = await _configRepository.GetByIdAsync(id);
        if (configEntity is not null)
        {
            await _cacheService.AddAsync(cacheKey, hashField, configEntity);
            return ApiResponse<ConfigEntity>.SuccessResult(configEntity);
        }

        return ApiResponse<ConfigEntity>.FailureResult(Constants.NotFound);
    }

    public async Task<ApiResponse<ConfigEntity>> UpdateAsync(ConfigEntity entity)
    {
        string cacheKey = $"{entity.Id}";
        var result = await _configRepository.Update(entity);
        if (result is not null)
        {
            await _cacheService.DeleteAsync(cacheKey);
            await _socketHub.Clients.Group(entity.ApplicationId.ToString()).SendAsync("SendFlagToClient", "true");
            return ApiResponse<ConfigEntity>.SuccessResult(entity);
        }
        else
        {
            return ApiResponse<ConfigEntity>.FailureResult(Constants.NotUpdated);
        }
    }

    public async Task<List<ConfigEntity>> GetByApplicationId(int applicationId)
    {
        return await _configRepository.GetByApplicationId(applicationId);
    }
}
