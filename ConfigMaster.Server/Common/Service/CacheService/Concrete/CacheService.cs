using ConfigMaster.Server.Common.Models.Utils;
using ConfigMaster.Server.Common.Service.CacheService.Abstract;
using Microsoft.Extensions.Options;
using Microsoft.FeatureManagement;

namespace ConfigMaster.Server.Common.Service.CacheService.Concrete;

public class CacheService
{
    private readonly IOptionsMonitor<AppSettings> _appSettings;
    private readonly IFeatureManager _featureManager;
    private ICacheMethod _cache;
    public CacheService(MemoryCacheMethod memoryCache, DistributedCacheMethod distrubutedCache, IOptionsMonitor<AppSettings> appSettings, IFeatureManager featureManager)
    {
        _appSettings = appSettings;
        _featureManager = featureManager;
        _cache = _featureManager.IsEnabledAsync("EnableInMemoryCache").Result ? memoryCache : distrubutedCache;
        #region OptionsMonitorOnChange
        //_cache = _appSettings.CurrentValue.RedisSettings.EnableInMemoryCache ? memoryCache : distrubutedCache;
        //_appSettings.OnChange((newSettings, _) =>
        //{
        //    _cache = newSettings.RedisSettings.EnableInMemoryCache ? memoryCache : distrubutedCache;
        //});
        #endregion
    }

    public async Task AddAsync<T>(string cacheKey, string hashField, T data, int cachingTime = 20)
    {
        await _cache.AddAsync(cacheKey, hashField, data, cachingTime);
    }

    public async Task DeleteAsync(string cacheKey)
    {
        await _cache.DeleteAsync(cacheKey);
    }

    public async Task<T> GetAsync<T>(string cacheKey, string hashField)
    {
        var result = await _cache.GetAsync<T>(cacheKey, hashField);
        return result;
    }
}
