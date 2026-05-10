using D365_Shared_Library.Connection;
using D365_Shared_Library.Repository;
using Microsoft.Xrm.Sdk;

namespace EMC.Server.Extensions
{
    public static class CRMConnectionExtension
    {
        public static readonly string CRMEnvironmentTarget = EnvironmentsNames.Development;

        public static IServiceCollection ServiceAndBaseRepository(this IServiceCollection services, IConfiguration config)
        {
            var serviceURL = config[$"Environments:{CRMEnvironmentTarget}:ServiceURL"] ?? "";
            var clientId = config[$"Environments:{CRMEnvironmentTarget}:ClientId"] ?? "";
            var clientSecret = config[$"Environments:{CRMEnvironmentTarget}:ClientSecret"] ?? "";

            var service = ServiceManager.GetService(serviceURL, clientId, clientSecret);

            services.AddSingleton<IOrganizationService>(service!);

            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
            return services;
        }
    }

    internal static class EnvironmentsNames
    {
        public const string Development = "Development";
        public const string SandBox = "SandBox";
        public const string Production = "Production";
    }
}
