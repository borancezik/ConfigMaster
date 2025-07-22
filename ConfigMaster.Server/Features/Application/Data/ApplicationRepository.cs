using ConfigMaster.Server.DataAccess;
using ConfigMaster.Server.Features.Application.Domain;
using Microsoft.EntityFrameworkCore;

namespace ConfigMaster.Server.Features.Application.Data;

public class ApplicationRepository(ApplicationContext context) : IApplicationRepository
{
    private readonly ApplicationContext _context = context;

    public async Task<ApplicationEntity> AddAsync(ApplicationEntity entity)
    {
        await _context.applications.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<List<ApplicationEntity>> GetAll()
    {
        return await _context.applications.ToListAsync();
    }
}
