using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ConfigMaster.Server.Common;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {

        var problemDetails = new ProblemDetails
        {
            Status = GetHttpStatusCode(exception),
            Title = "Server error",
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;

        await httpContext.Response
            .WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    private int GetHttpStatusCode(Exception exception)
    {
        if (exception is UnauthorizedAccessException)
        {
            return StatusCodes.Status401Unauthorized;
        }

        return StatusCodes.Status500InternalServerError;
    }
}
