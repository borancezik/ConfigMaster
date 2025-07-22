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
    
