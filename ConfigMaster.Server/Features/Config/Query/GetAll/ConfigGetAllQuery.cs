using ConfigMaster.Server.Features.Config.Domain;
using MediatR;

namespace ConfigMaster.Features.Config.Query.GetAll;

public record ConfigGetAllQuery : IRequest<List<ConfigEntity>>
{
    public int Page { get; set; }
    public int Size { get; set; }
    public long Id { get; set; }
}
