using ConfigMaster.Server.Common.Service.CacheService.Abstract;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;
using System.Text.Json;

namespace ConfigMaster.Server.Common.Service.CacheService.Concrete;

public class DistributedCacheMethod : ICacheMethod
{
    private readonly IDistributedCache _distributedCache;
    private readonly IDatabase _redisDatabase;

    public DistributedCacheMethod(IDistributedCache distributedCache, IConnectionMultiplexer redisConnection)
    {
        _distributedCache = distributedCache;
        _redisDatabase = redisConnection.GetDatabase();
    }

    public async Task AddAsync<T>(string cacheKey, string hashField, T data, int cachingTime = 20)
    {
        await _redisDatabase.HashSetAsync(cacheKey, hashField, JsonSerializer.Serialize(data));

        await _redisDatabase.KeyExpireAsync(cacheKey, TimeSpan.FromMinutes(cachingTime));
    }

    public async Task DeleteAsync(string cacheKey)
    {
        await _redisDatabase.KeyDeleteAsync(cacheKey);
    }

    public async Task<T> GetAsync<T>(string cacheKey, string hashField)
    {
        var hashSetKey = cacheKey;

        var cachedDataString = await _redisDatabase.HashGetAsync(hashSetKey, hashField);

        if (!cachedDataString.IsNull)
        {
            return JsonSerializer.Deserialize<T>(cachedDataString);
        }

        return default(T);
    }
}
