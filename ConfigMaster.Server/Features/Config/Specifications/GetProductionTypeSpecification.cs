using ConfigMaster.Server.Common.Models.Utils;
using ConfigMaster.Server.Common.Specification;
using ConfigMaster.Server.Features.Config.Domain;
using System.Linq.Expressions;

namespace ConfigMaster.Features.Config.Specifications;

public class GetProductionTypeSpecification : Specification<ConfigEntity>
{
    private readonly int _applicationId;
    public GetProductionTypeSpecification(int applicationId)
    {
        _applicationId = applicationId;
    }
    public override Expression<Func<ConfigEntity, bool>> Expression()
    {
        return p => p.EnvType == (int)EnvType.PRODUCTION && p.ApplicationId == _applicationId;
    }
}
