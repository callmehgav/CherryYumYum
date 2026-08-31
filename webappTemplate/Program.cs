using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Net.WebSockets;
using System.Text.Json;
using webappTemplate;
using webappTemplate.Services;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // =====================================================
        // SERVICES
        // =====================================================

        builder.Services.AddMemoryCache();

        builder.Services.Configure<AppSettings>(
            builder.Configuration
        );

        builder.Services
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy =
                    JsonNamingPolicy.CamelCase;
            });

        builder.Services.AddHttpClient<InstagramService>();

        builder.Services.AddAuthorization();


        // =====================================================
        // CORS
        // =====================================================

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowAngularApp",
                policy => policy
                    .WithOrigins(
                        "http://localhost:4200",
                        "https://localhost:4200"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
            );
        });


        var app = builder.Build();


        // =====================================================
        // ANGULAR STATIC FILES
        // =====================================================

        /*
         * Allows "/" to resolve to wwwroot/index.html.
         */
        app.UseDefaultFiles();

        /*
         * Serves Angular JS, CSS, assets, images, etc.
         * from wwwroot.
         */
        app.UseStaticFiles();


        // =====================================================
        // WEBSOCKETS
        // =====================================================

        app.UseWebSockets();

        var conduit = new Conduit();

        app.Use(async (context, next) =>
        {
            if (context.Request.Path == "/ws")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var webSocket =
                        await context.WebSockets.AcceptWebSocketAsync();

                    await conduit.ListenWebSocketAsync(webSocket);
                }
                else
                {
                    context.Response.StatusCode = 400;
                }

                return;
            }

            await next();
        });


        // =====================================================
        // API
        // =====================================================

        app.UseRouting();

        app.UseCors("AllowAngularApp");

        app.UseAuthorization();

        app.MapControllers();


        // =====================================================
        // ANGULAR ROUTE FALLBACK
        // =====================================================

        /*
         * Any route that isn't an API/controller/static file
         * gets handed to Angular.
         *
         * This also prevents 404s when refreshing Angular routes.
         */
        app.MapFallbackToFile("index.html");


        app.Run();
    }
}