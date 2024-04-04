using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetDevelopmentType;

public record GetDevelopmentTypeQuery : IRequest<ApiResponse<ConfigEntity>>
{
    public int ApplicationId { get; set; }
}
