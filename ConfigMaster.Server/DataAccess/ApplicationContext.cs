using ConfigMaster.Server.Features.Application.Domain;
using ConfigMaster.Server.Features.Config.Domain;
using Microsoft.EntityFrameworkCore;

namespace ConfigMaster.Server.DataAccess;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<ConfigEntity> configs { get; set; }
    public DbSet<ApplicationEntity> applications { get; set; }
}
