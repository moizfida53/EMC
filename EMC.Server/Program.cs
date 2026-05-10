using D365_Shared_Library.Repository;
using EMC.Server.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using EMC.Server.BLL.Interfaces;
using EMC.Server.BLL.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ─────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.ServiceAndBaseRepository(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

// BLL service registrations — add new IXxxService / XxxService pairs below.
builder.Services.AddScoped<IDemoService,DemoService>();

// JWT Bearer auth via Microsoft Identity Web (Azure AD).
// Note: EnableTokenAcquisitionToCallDownstreamApi() is intentionally NOT called —
// EMC.Server validates incoming tokens but does not call downstream APIs on behalf
// of the user. Re-add it (with proper ClientSecret config) only if/when needed.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// CORS — allow the Angular SPA dev origin.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("https://localhost:64254")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .SetIsOriginAllowedToAllowWildcardSubdomains());
});

var app = builder.Build();

// ── Pipeline ─────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseCors("AllowAngular");
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Disabled in dev so the Angular Vite proxy can talk to us on plain HTTP
// (proxy.conf.js targets http://localhost:5270). Re-enabled in prod.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
