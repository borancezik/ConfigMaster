using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using ConfigMaster.Server.Features.Config.Service;
using FluentValidation;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetById;

internal sealed class ConfigQueryHandler : IRequestHandler<ConfigQuery, ApiResponse<ConfigEntity>>
{
    private readonly IConfigService _configService;
    private readonly IValidator<ConfigQuery> _validator;
    public ConfigQueryHandler(IConfigService configService, IValidator<ConfigQuery> validator)
    {
        _configService = configService;
        _validator = validator;
    }

    public async Task<ApiResponse<ConfigEntity>> Handle(ConfigQuery request, CancellationToken cancellationToken)
    {
        return await _configService.GetByIdAsync(request.Id);
    }
}
