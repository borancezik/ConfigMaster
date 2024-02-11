using ConfigMaster.Server.Common.Models;
using ErrorOr;
using FluentValidation;
using MediatR;

namespace ConfigMaster.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : 
    IPipelineBehavior<TRequest, ApiResponse<TResponse>> 
    where TRequest : IRequest<ApiResponse<TResponse>> 
    where TResponse : class
{
    private readonly IValidator<TRequest>? _validator;

    public ValidationBehavior(IValidator<TRequest>? validator = null)
    {
        _validator= validator;
    }

    public async Task<ApiResponse<TResponse>> Handle(TRequest request, RequestHandlerDelegate<ApiResponse<TResponse>> next, CancellationToken cancellationToken)
    {
        if (_validator is null)
        {
            return await next();
        }

        var validationResult = await _validator.ValidateAsync(request, cancellationToken);

        if (validationResult.IsValid)
        {
            return await next();
        }

        var errors = validationResult.Errors
            .ConvertAll(validationFailure => Error.Validation(
                validationFailure.PropertyName,
                validationFailure.ErrorMessage));

        return ApiResponse<TResponse>.FailureResult(errors.First().Description);
    }
}
