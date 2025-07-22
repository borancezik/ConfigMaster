using ConfigMaster.Server.Features.Application.Domain;
using MediatR;

namespace ConfigMaster.Server.Features.Application.Query.GetAll;

public record ApplicationGetAllQuery : IRequest<List<ApplicationEntity>>;

