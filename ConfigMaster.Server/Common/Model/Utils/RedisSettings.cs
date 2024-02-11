namespace ConfigMaster.Server.Common.Models.Utils;

public class RedisSettings
{
    public string ServiceUrl { get; set; }
    public string Password { get; set; }
    public bool EnableInMemoryCache { get; set; }
}
