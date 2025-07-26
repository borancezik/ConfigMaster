using ConfigMaster.Server.Features.Application.Data;
using ConfigMaster.Server.Features.Application.Domain;
using MediatR;

namespace ConfigMaster.Server.Features.Application.Query.GetAll;

internal sealed class ApplicationGetAllQueryHandler(IApplicationRepository applicationRepository) : IRequestHandler<ApplicationGetAllQuery, List<ApplicationEntity>>
{
    private readonly IApplicationRepository _applicationRepository = applicationRepository;
    public async Task<List<ApplicationEntity>> Handle(ApplicationGetAllQuery request, CancellationToken cancellationToken)
    {
        return await _applicationRepository.GetAll();
    }
}
