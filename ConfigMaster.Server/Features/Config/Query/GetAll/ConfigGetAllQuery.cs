using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetAll;

public record ConfigGetAllQuery : IRequest<List<ConfigEntity>>;
