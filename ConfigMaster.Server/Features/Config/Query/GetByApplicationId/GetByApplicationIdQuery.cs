using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Server.Features.Config.Query.GetByApplicationId;

public record GetByApplicationIdQuery(int applicationId) : IRequest<List<ConfigEntity>>;
