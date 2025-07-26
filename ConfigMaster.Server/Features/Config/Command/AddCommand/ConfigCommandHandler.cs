using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using ConfigMaster.Server.Features.Config.Service;
using FluentValidation;
using MediatR;

namespace ConfigMaster.Features.Config.Command.AddCommand;

internal sealed class ConfigCommandHandler(IConfigService configService, IValidator<ConfigCommand> validator) : IRequestHandler<ConfigCommand, ApiResponse<ConfigEntity>>
{
    private readonly IConfigService _configService = configService;
    private readonly IValidator<ConfigCommand> _validator = validator;
    public async Task<ApiResponse<ConfigEntity>> Handle(ConfigCommand request, CancellationToken cancellationToken)
    {
        var checkConfigByEnvironmentType = await _configService.GetByFilter(x => x.ApplicationId == request.ApplicationId && x.EnvType == request.EnvType);
        if (checkConfigByEnvironmentType is not null)
        {
            return ApiResponse<ConfigEntity>.FailureResult("Configuration for this environment already exists.");
        }

        var config = new ConfigEntity { ApplicationId = request.ApplicationId, EnvType = request.EnvType, Config = request.Config, ConfigType = request.ConfigType };
        var result = await _configService.AddAsync(config);
        return result;
    }
}
