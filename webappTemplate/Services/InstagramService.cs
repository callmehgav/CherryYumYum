using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;

namespace webappTemplate.Services
{
    public class InstagramService
    {
        private readonly HttpClient _httpClient;

        private readonly string _accessToken =
            "EAAKEKJNV9pgBSN6OqzmIV0wfM5MfjfZBfO16795JgoWx8UuNwMLEe9hiOg0DBaoxutbubt5FAssYAZBMy3XpXpH73P5tiD9l9JaFMLVE3jnI3Hu4I3oGMWpBdhlC4ZCWkxkRqwRMIvoEmU5AogJ1TqhfVmHsi4uS9Mth9mgekbvoQ9pAmdHbXMr1QZA7yGn5";

        private readonly string _igBusinessAccountId =
            "17841401334404994";

        private readonly IMemoryCache _cache;

        public InstagramService(
            HttpClient httpClient,
            IMemoryCache cache)
        {
            _httpClient = httpClient;
            _cache = cache;
        }

        public async Task<InstagramMediaResponse> GetMediaAsync()
        {
            const string cacheKey = "instagramMediaCache";

            if (_cache.TryGetValue(
                    cacheKey,
                    out InstagramMediaResponse? cachedResponse) &&
                cachedResponse is not null)
            {
                return cachedResponse;
            }

            var url =
                $"https://graph.facebook.com/v19.0/{_igBusinessAccountId}/media" +
                $"?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink" +
                $"&access_token={_accessToken}";

            var response =
                await _httpClient
                    .GetFromJsonAsync<InstagramMediaResponse>(url);

            if (response is null)
            {
                throw new InvalidOperationException(
                    "Instagram returned an empty response.");
            }

            var cacheEntryOptions =
                new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow =
                        TimeSpan.FromMinutes(15)
                };

            _cache.Set(
                cacheKey,
                response,
                cacheEntryOptions);

            return response;
        }
    }

    public class InstagramMediaResponse
    {
        public List<InstagramMediaItem> Data { get; set; } = [];
    }

    public class InstagramMediaItem
    {
        public string Id { get; set; } = string.Empty;

        public string? Caption { get; set; }

        [JsonPropertyName("media_type")]
        public string MediaType { get; set; } = string.Empty;

        [JsonPropertyName("media_url")]
        public string? MediaUrl { get; set; }

        [JsonPropertyName("thumbnail_url")]
        public string? ThumbnailUrl { get; set; }

        public string Timestamp { get; set; } = string.Empty;

        public string Permalink { get; set; } = string.Empty;
    }
}