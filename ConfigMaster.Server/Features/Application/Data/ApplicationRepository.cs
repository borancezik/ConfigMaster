using ConfigMaster.Server.Common.Repository;
using ConfigMaster.Server.DataAccess;
using ConfigMaster.Server.Features.Application.Domain;

namespace ConfigMaster.Server.Features.Application.Data;

public class ApplicationRepository : RepositoryBase<ApplicationEntity, ApplicationContext>, IApplicationRepository
{
    public ApplicationRepository(ApplicationContext context) : base(context)
    {
    }
}
