using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using ConfigMaster.NuGet.Models;
using ConfigMaster.NuGet.Utils;
using Microsoft.AspNetCore.SignalR.Client;

namespace ConfigMasterNuget;

public static class ApplicationConfig
{
    public static async Task CreateConfigMasterClient(this IServiceCollection serviceColleciton, IConfigurationManager configuration, IWebHostEnvironment environment)
    {

        var serviceUrl = configuration.GetValue<string>(CommonConstans.ServiceUrl) ??
                          throw new ConfigMasterException(ErrorConstans.UrlNotFound);
        var applicationId = configuration.GetValue<string>(CommonConstans.ApplicationId) ??
                           throw new ConfigMasterException(ErrorConstans.AppIdNotFound);
        try
        {
            await GetApplicationConfig(configuration, environment, serviceUrl, applicationId);

            var hubConnection = new HubConnectionBuilder()
                .WithUrl($"{serviceUrl}/config-master-hub")
                .Build();

            hubConnection.Closed += async (error) =>
            {
                while (true)
                {
                    try
                    {
                        await Task.Delay(new Random().Next(0, 5) * 1000);
                        await hubConnection.StartAsync();
                        await hubConnection.InvokeAsync("Register", applicationId);
                        break;
                    }
                    catch (Exception ex)
                    {
                        throw new ConfigMasterException($"{ErrorConstans.RestartConnection + ex.Message}");
                    }
                }
            };

            await hubConnection.StartAsync();
            await hubConnection.InvokeAsync("Register", applicationId);

            hubConnection.On<string>("SendFlagToClient", async (message) =>
            {
                await GetApplicationConfig(configuration, environment, serviceUrl, applicationId);
            });

        }
        catch (Exception ex)
        {
            throw new ConfigMasterException($"Exception: {ex.Message}");
        }
    }

    public static async Task GetApplicationConfig(IConfigurationManager configuration, IWebHostEnvironment environment, string serviceUrl, string applicationId)
    {
        var currentEnvironment = environment.IsProduction();

        string url = $"{serviceUrl}/api/configs/{(currentEnvironment ? "production" : "development")}/{applicationId}";

        using (HttpClient httpClient = new HttpClient())
        {
            try
            {
                var response = httpClient.GetAsync(url).GetAwaiter().GetResult();

                if (response.IsSuccessStatusCode)
                {
                    string jsonString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    var remoteSettings = JsonConvert.DeserializeObject<Response>(jsonString);

                    if (!remoteSettings.IsSuccess)
                    {
                        throw new ConfigMasterException($"{ErrorConstans.ServerError}{remoteSettings.Message}");
                    }

                    byte[] configBytes = Encoding.ASCII.GetBytes(remoteSettings.Data.Config);
                    configuration.AddJsonStream(new MemoryStream(configBytes));
                }
                else
                {
                    throw new ConfigMasterException(ErrorConstans.ServerResponse);
                }
            }
            catch (Exception ex)
            {
                throw new ConfigMasterException($"Exception: {ex.Message}");
            }
        }
    }
}

