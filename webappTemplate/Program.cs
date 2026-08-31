using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Net.WebSockets;
using System.Text.Json;
using System.Threading.Tasks;
using webappTemplate;
using webappTemplate.Services;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddMemoryCache();
        builder.Services.Configure<AppSettings>(builder.Configuration);

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

        builder.Services.AddHttpClient<InstagramService>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularApp",
                policy => policy
                    .WithOrigins("http://localhost:4200", "https://localhost:4200", "https://localhost:5000", "https://localhost:5001")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()); // optional if sending cookies
        });

        var app = builder.Build();

        app.UseWebSockets();

        var conduit = new Conduit();
        app.Use(async (context, next) =>
        {
            if (context.Request.Path == "/ws")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await conduit.ListenWebSocketAsync(webSocket);
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            }
            else
            {
                await next();
            }
        });


        // Correct middleware order:
        app.UseRouting();
        app.UseCors("AllowAngularApp");
        app.UseAuthorization();

        // Uncomment only if your Angular frontend is served over HTTPS during local dev
        // Otherwise, it will continue to redirect your HTTP POST to HTTPS and cause CORS issues
        // app.UseHttpsRedirection();

        app.MapControllers();

        app.Run();
    }
}
