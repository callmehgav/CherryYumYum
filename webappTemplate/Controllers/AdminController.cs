using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace webappTemplate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class AdminLoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginRequest request)
        {
            if (request.Username == _configuration["Admin:Username"] &&
                request.Password == _configuration["Admin:Password"])
            {
                return Ok(new { success = true, message = "Login successful." });
            }
            else
            {
                return Unauthorized(new { success = false, message = "Invalid credentials." });
            }
        }
    }
}
