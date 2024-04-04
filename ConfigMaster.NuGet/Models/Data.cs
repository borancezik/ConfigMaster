namespace ConfigMaster.NuGet.Models;

public record Data
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public int EnvType { get; set; }
    public int ConfigType { get; set; }
    public string Config { get; set; }
}
