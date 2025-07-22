using ConfigMaster.Features.Config.Command.AddCommand;
using ConfigMaster.Features.Config.Command.UpdateCommand;
using ConfigMaster.Features.Config.Query.GetAll;
using ConfigMaster.Features.Config.Query.GetById;
using ConfigMaster.Features.Config.Query.GetDevelopmentType;
using ConfigMaster.Features.Config.Query.GetProductionType;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ConfigMaster.Server.Features.Config;

public static class ConfigEndpoints
{
    public static void MapEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("api/configs/add", async ([FromBody] ConfigCommand command, ISender sender) =>
        {
            return await sender.Send(command);
        });

        app.MapPost("api/configs/update", async ([FromBody] UpdateConfigCommand command, ISender sender) =>
        {
            return await sender.Send(command);
        });

        app.MapGet("api/configs/{id}", async (int id, ISender sender) =>
        {
            return await sender.Send(new ConfigQuery() { Id = id });
        });

        app.MapGet("api/configs", async (ISender sender) =>
        {
            return await sender.Send(new ConfigGetAllQuery());
        });

        app.MapGet("api/configs/production/{applicationId}", async (int applicationId, ISender sender) =>
        {
            return await sender.Send(new GetProductionTypeQuery() { ApplicationId = applicationId });
        });

        app.MapGet("api/configs/development/{applicationId}", async (int applicationId, ISender sender) =>
        {
            return await sender.Send(new GetDevelopmentTypeQuery() { ApplicationId = applicationId });
        });
    }
}
