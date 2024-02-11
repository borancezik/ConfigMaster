namespace ConfigMaster.Server.Common.Service.CacheService.Abstract;

public interface ICacheMethod
{
    Task AddAsync<T>(string cacheKey, string hashField, T data, int cachingTime = 20);
    Task DeleteAsync(string cacheKey);
    Task<T> GetAsync<T>(string cacheKey, string hashField);
}
