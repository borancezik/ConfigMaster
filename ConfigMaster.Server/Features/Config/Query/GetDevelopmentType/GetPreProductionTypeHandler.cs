using ConfigMaster.Features.Config.Specifications;
using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using ConfigMaster.Server.Features.Config.Service;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetDevelopmentType;

public class GetDevelopmentTypeHandler : IRequestHandler<GetDevelopmentTypeQuery, ApiResponse<ConfigEntity>>
{
    private readonly IConfigService _configService;
    public GetDevelopmentTypeHandler(IConfigService configService)
    {
        _configService = configService;
    }
    public Task<ApiResponse<ConfigEntity>> Handle(GetDevelopmentTypeQuery request, CancellationToken cancellationToken)
    {
        var specification = new GetProductionTypeSpecification(request.ApplicationId);
        return _configService.GetByFilter(specification);
    }
}
