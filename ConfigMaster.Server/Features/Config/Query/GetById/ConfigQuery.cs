using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetById;

public record ConfigQuery : IRequest<ApiResponse<ConfigEntity>>
{
    public long Id { get; set; }
}
