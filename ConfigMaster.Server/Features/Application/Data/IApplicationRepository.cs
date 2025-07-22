using ConfigMaster.Server.Features.Application.Domain;

namespace ConfigMaster.Server.Features.Application.Data;

public interface IApplicationRepository
{
    Task<ApplicationEntity> AddAsync(ApplicationEntity entity);
    Task<List<ApplicationEntity>> GetAll();
}
