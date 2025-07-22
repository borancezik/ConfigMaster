using ConfigMaster.Server.Common.Models;
using ConfigMaster.Server.Common.Models.Utils;
using ConfigMaster.Server.Features.Application.Data;
using ConfigMaster.Server.Features.Application.Domain;
using MediatR;

namespace ConfigMaster.Server.Features.Application.Command.Add;

public class ApplicationAddCommandHandler(IApplicationRepository applicationRepository) : IRequestHandler<ApplicationAddCommand, ApiResponse<ApplicationEntity>>
{
    private readonly IApplicationRepository _applicationRepository = applicationRepository;
    public async Task<ApiResponse<ApplicationEntity>> Handle(ApplicationAddCommand request, CancellationToken cancellationToken)
    {
        var application = new ApplicationEntity
        {
            Name = request.Name,
            Domain = request.Domain,
            Port = request.Port
        };

        var result = await _applicationRepository.AddAsync(application);

        if (result is not null)
        {
            return ApiResponse<ApplicationEntity>.SuccessResult(result);
        }
        else
        {
            return ApiResponse<ApplicationEntity>.FailureResult(Constants.NotUpdated);
        }
    }
}
