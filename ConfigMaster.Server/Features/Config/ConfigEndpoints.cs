using ConfigMaster.Features.Config.Command.AddCommand;
using ConfigMaster.Features.Config.Command.UpdateCommand;
using ConfigMaster.Features.Config.Query.GetById;
using ConfigMaster.Server.Features.Config.Query.GetByApplicationId;
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

        app.MapPut("api/configs/update", async ([FromBody] UpdateConfigCommand command, ISender sender) =>
        {
            return await sender.Send(command);
        });

        app.MapGet("api/configs/{id}", async (int id, ISender sender) =>
        {
            return await sender.Send(new ConfigQuery() { Id = id });
        });

        app.MapGet("api/configs/getbyapplicationid/{id}", async (int id, ISender sender) =>
        {
            return await sender.Send(new GetByApplicationIdQuery(applicationId:id));
        });
    }
}
