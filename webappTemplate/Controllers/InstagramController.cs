using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using webappTemplate.Services;

namespace webappTemplate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstagramController : ControllerBase
    {
        private readonly InstagramService _instagramService;

        public InstagramController(InstagramService instagramService)
        {
            _instagramService = instagramService;
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetFeed()
        {
            var media = await _instagramService.GetMediaAsync();
            return Ok(media.Data); // ✅ Return only the list, not wrapped in { data: [...] }
        }
    }
}
