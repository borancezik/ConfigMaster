namespace ConfigMaster.NuGet.Models;

public record Response
{
    public Data Data { get; set; }
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
}
