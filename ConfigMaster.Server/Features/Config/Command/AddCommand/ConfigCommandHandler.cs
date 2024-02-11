using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Features.Config.Domain;
using ConfigMaster.Server.Features.Config.Service;
using FluentValidation;
using MediatR;

namespace ConfigMaster.Features.Config.Command.AddCommand;

internal sealed class ConfigCommandHandler : IRequestHandler<ConfigCommand, ApiResponse<ConfigEntity>>
{
    private readonly IConfigService _configService;
    private readonly IValidator<ConfigCommand> _validator;
    public ConfigCommandHandler(IConfigService configService, IValidator<ConfigCommand> validator)
    {
        _configService = configService;
        _validator = validator;
    }
    public async Task<ApiResponse<ConfigEntity>> Handle(ConfigCommand request, CancellationToken cancellationToken)
    {
        var config = new ConfigEntity { ApplicationId = request.ApplicationId, EnvType = request.EnvType, Config = request.Config, ConfigType = request.ConfigType };

        var result = await _configService.AddAsync(config);

        return result;
    }
}
