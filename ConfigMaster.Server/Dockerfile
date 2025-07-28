FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ConfigMaster.Server/ConfigMaster.Server.csproj", "ConfigMaster.Server/"]
COPY . .
WORKDIR "/src/ConfigMaster.Server"
RUN dotnet restore "ConfigMaster.Server.csproj"
RUN dotnet build "ConfigMaster.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ConfigMaster.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "ConfigMaster.Server.dll"]