using ConfigMaster.Features.Config.Command.AddCommand;
using ConfigMaster.Features.Config.Command.UpdateCommand;
using ConfigMaster.Features.Config.Query.GetAll;
using ConfigMaster.Features.Config.Query.GetById;
using ConfigMaster.Features.Config.Query.GetDevelopmentType;
using ConfigMaster.Features.Config.Query.GetProductionType;
using ConfigMaster.Server.Features.Application.Command.Add;
using ConfigMaster.Server.Features.Application.Query.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ConfigMaster.Server.Features.Application;

public static class ApplicationEndpoints
{
    public static void MapEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("api/applications/add", async ([FromBody] ApplicationAddCommand command, ISender sender) =>
        {
            return await sender.Send(command);
        });

        app.MapGet("api/applications", async (ISender sender) =>
        {
            return await sender.Send(new ApplicationGetAllQuery());
        });
    }
}
    
