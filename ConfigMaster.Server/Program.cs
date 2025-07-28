using ConfigMaster.Common.Behaviors;
using ConfigMaster.Features.Config.Command.AddCommand;
using ConfigMaster.Features.Config.Query.GetById;
using ConfigMaster.Server.Common;
using ConfigMaster.Server.Common.Models.Utils;
using ConfigMaster.Server.Common.Service.CacheService.Abstract;
using ConfigMaster.Server.Common.Service.CacheService.Concrete;
using ConfigMaster.Server.DataAccess;
using ConfigMaster.Server.Features.Application;
using ConfigMaster.Server.Features.Application.Data;
using ConfigMaster.Server.Features.Config;
using ConfigMaster.Server.Features.Config.Data;
using ConfigMaster.Server.Features.Config.Service;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;
using StackExchange.Redis;
using System;

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

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<ApplicationContext>();
        if (dbContext.Database.GetPendingMigrations().Any())
        {
            app.Logger.LogInformation("Applying database migrations...");
            dbContext.Database.Migrate();
            app.Logger.LogInformation("Database migrations applied successfully.");
        }
        else
        {
            app.Logger.LogInformation("No pending database migrations to apply.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while applying migrations to the database. Please ensure your local PostgreSQL is running and accessible.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

ConfigEndpoints.MapEndpoints(app);
ApplicationEndpoints.MapEndpoints(app);

app.UseHttpsRedirection();

app.UseCors(builder => builder
    .WithOrigins("http://localhost:5173/","https://localhost:5173/","http://localhost:5173", "https://localhost:5173", "http://localhost:51151/", "https://localhost:51151/", "http://localhost:51151", "https://localhost:51151", "http://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
