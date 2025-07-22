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
using ConfigMaster.Common.Behaviors;
using ConfigMaster.Features.Config.Command.AddCommand;
using ConfigMaster.Features.Config.Query.GetById;
using ConfigMaster.Server.Features.Config.Service;
using FluentValidation;
using MediatR;
using ConfigMaster.Server.Features.Config;
using ConfigMaster.Server.Features.Application;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddScoped<IConfigRepository, ConfigRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IConfigService, ConfigService>();
builder.Services.AddScoped<CacheService>();
builder.Services.AddScoped<ICacheMethod, MemoryCacheMethod>();
builder.Services.AddScoped<ICacheMethod, DistributedCacheMethod>();
builder.Services.AddScoped<MemoryCacheMethod>();
builder.Services.AddScoped<DistributedCacheMethod>();
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddTransient<IValidator<ConfigQuery>, ConfigQueryValidator>();
builder.Services.AddTransient<IValidator<ConfigCommand>, ConfigCommandValidator>();
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

ConfigEndpoints.MapEndpoints(app);
ApplicationEndpoints.MapEndpoints(app);

app.UseHttpsRedirection();

app.UseCors(builder => builder
    .WithOrigins("http://localhost:5173/","https://localhost:5173/","http://localhost:5173", "https://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
