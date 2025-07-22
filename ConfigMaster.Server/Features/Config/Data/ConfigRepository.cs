using ConfigMaster.Server.DataAccess;
using ConfigMaster.Server.Features.Config.Domain;
using Microsoft.EntityFrameworkCore;

namespace ConfigMaster.Server.Features.Config.Data;

public class ConfigRepository(ApplicationContext context) : IConfigRepository
{
    private readonly ApplicationContext _context = context;

    public async Task<ConfigEntity> AddAsync(ConfigEntity entity)
    {
        await _context.configs.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<List<ConfigEntity>> GetByApplicationId(int applicationId)
    {
        return await _context.configs
            .Where(c => c.ApplicationId == applicationId).ToListAsync();
    }

    public async Task<ConfigEntity> GetByIdAsync(long id)
    {
        return await _context.configs
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<ConfigEntity> Update(ConfigEntity entity)
    {
        _context.configs.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}
