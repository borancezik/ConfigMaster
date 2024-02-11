using Microsoft.AspNetCore.SignalR;

namespace ConfigMaster.Server.Common.Service.SocketServerService;

public class SocketServerService : Hub
{
    public async Task Register(string applicationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, applicationId);
    }
}