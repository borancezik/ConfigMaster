using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Features.Config.Command.AddCommand;

public record ConfigCommand : IRequest<ApiResponse<ConfigEntity>>
{
    public required int ApplicationId { get; set; }
    public required int EnvType { get; set; }
    public required int ConfigType { get; set; }
    public required string Config { get; set; }
}
