using ConfigMaster.Server.Features.Config.Data;
using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Server.Features.Config.Query.GetByApplicationId;

internal sealed class GetByApplicationIdQueryHandler(IConfigRepository configRepository) : IRequestHandler<GetByApplicationIdQuery, List<ConfigEntity>>
{
    private readonly IConfigRepository _configRepository = configRepository;

    public async Task<List<ConfigEntity>> Handle(GetByApplicationIdQuery request, CancellationToken cancellationToken)
    {
        return await _configRepository.GetByApplicationId(request.applicationId);
    }
}
