using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Application.Domain;
using MediatR;

namespace ConfigMaster.Server.Features.Application.Command.Add;

public record ApplicationAddCommand : IRequest<ApiResponse<ApplicationEntity>>
{
    public required string Name { get; set; }
    public required string Domain { get; set; }
    public required string Port { get; set; }
}
