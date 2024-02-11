namespace ConfigMaster.Features.Config.Query.GetById;

public class ConfigQueryResponse
{
    public long Id { get; set; }
    public int? ApplicationId { get; set; }
    public int? EnvType { get; set; }
    public int? ConfigType { get; set; }
    public string? Config { get; set; }
}
