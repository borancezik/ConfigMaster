using ConfigMaster.Server.Common.Repository;
using ConfigMaster.Server.DataAccess;
using ConfigMaster.Server.Features.Config.Domain;

namespace ConfigMaster.Server.Features.Config.Data;

public class ConfigRepository : RepositoryBase<ConfigEntity, ApplicationContext>, IConfigRepository
{
    private readonly ApplicationContext _context;

    public ConfigRepository(ApplicationContext context) : base(context)
    {
        _context = context;
    }
}
