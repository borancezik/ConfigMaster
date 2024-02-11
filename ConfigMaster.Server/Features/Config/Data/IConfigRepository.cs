using ConfigMaster.Server.Common.Repository;
using ConfigMaster.Server.Features.Config.Domain;

namespace ConfigMaster.Server.Features.Config.Data;

public interface IConfigRepository : IRepositoryBase<ConfigEntity>;
