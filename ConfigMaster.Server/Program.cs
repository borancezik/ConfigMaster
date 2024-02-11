using ConfigMaster.Server.Common.Models.Utils;
using ConfigMaster.Server.Common;
using ConfigMaster.Server.Features.Config.Data;
using ConfigMaster.Server.Common.Service.CacheService.Abstract;
using ConfigMaster.Server.Common.Service.CacheService.Concrete;
using ConfigMaster.Server.Features.Application.Data;
using ConfigMaster.Server.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddScoped<IConfigRepository, ConfigRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<CacheService>();
builder.Services.AddScoped<ICacheMethod, MemoryCacheMethod>();
builder.Services.AddScoped<ICacheMethod, DistributedCacheMethod>();
builder.Services.AddScoped<MemoryCacheMethod>();
builder.Services.AddScoped<DistributedCacheMethod>();
builder.Services.AddFeatureManagement();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    return ConnectionMultiplexer.Connect("localhost:6379");
});
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = "localhost:6379";
    options.InstanceName = "SampleInstance";
});
builder.Services.AddDbContext<ApplicationContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddMemoryCache();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
