namespace ConfigMaster.Server.Common.Models;

public class ApiResponse<T>
{
    public T? Data { get; set; }
    public bool IsSuccess { get; set; } = false;
    public string? Message { get; set; }

    public static ApiResponse<T> SuccessResult(T data, string message = "")
    {
        return new ApiResponse<T>
        {
            IsSuccess = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> FailureResult(string message)
    {
        return new ApiResponse<T>
        {
            IsSuccess = false,
            Message = message,
            Data = default
        };
    }

}
