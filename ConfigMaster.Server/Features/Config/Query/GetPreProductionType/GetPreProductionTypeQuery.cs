using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetPreProductionType;

public record GetPreProductionTypeQuery : IRequest<ApiResponse<ConfigEntity>>
{
    public int ApplicationId { get; set; }
}
