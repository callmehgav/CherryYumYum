using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Net.Mail;
using System.Threading.Tasks;

namespace webappTemplate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppSettings _appSettings;

        public ContactController(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContactFormModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            try
            {
                var smtpConfig = _appSettings.Smtp;

                var message = new MailMessage
                {
                    From = new MailAddress(smtpConfig.From),
                    Subject = "New Contact Form Submission",
                    Body = $"Name: {model.FirstName} {model.LastName}\n" +
                           $"Email: {model.Email}\n" +
                           $"Phone: {model.Phone}\n\n" +
                           $"Message:\n{model.Message}"
                };

                message.To.Add(smtpConfig.To);

                using var smtp = new SmtpClient(smtpConfig.Host)
                {
                    Port = smtpConfig.Port,
                    Credentials = new System.Net.NetworkCredential(smtpConfig.Username, smtpConfig.Password),
                    EnableSsl = true
                };

                await smtp.SendMailAsync(message);

                return Ok(new { success = true });
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP Error sending email: {smtpEx}");
                return StatusCode(500, $"SMTP Error sending message: {smtpEx.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error sending email: {ex}");
                return StatusCode(500, $"Error sending message: {ex.Message}");
            }
        }
    }

    public class ContactFormModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Message { get; set; }
    }
}
