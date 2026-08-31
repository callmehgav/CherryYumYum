using System;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace webappTemplate
{
    public class Conduit
    {
        public async Task ListenWebSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result;

            do
            {
                // Receive the message
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                var messageJson = Encoding.UTF8.GetString(buffer, 0, result.Count);

                if (string.IsNullOrWhiteSpace(messageJson))
                {
                    Console.WriteLine("Received empty WebSocket message, ignoring.");
                    continue;
                }

                WebSocketMessage message;
                try
                {
                    message = JsonSerializer.Deserialize<WebSocketMessage>(messageJson);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Invalid JSON received on WebSocket: {ex.Message}");
                    continue;
                }

                if (message == null)
                {
                    Console.WriteLine("Received null message after deserialization, ignoring.");
                    continue;
                }

                if (message != null)
                {
                    // Type checking to handle different kinds of messages
                    switch (message.Type)
                    {
                        case "frontendMsg":
                            Console.WriteLine("Handling frontend message");
                            Console.WriteLine($"Payload: {message.Payload}");
                            break;

                        case "backendMsg":
                            Console.WriteLine("Handling backend message");
                            Console.WriteLine($"Payload: {message.Payload}");
                            break;

                        default:
                            Console.WriteLine("Unknown message type received");
                            break;
                    }
                }

                // Optionally echo the message back to the frontend
                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);

            } while (!result.CloseStatus.HasValue);

            // Close the WebSocket connection
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }
}
