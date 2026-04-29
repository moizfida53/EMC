using EMC.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace EMC.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries =
        [
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        ];

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var data = Enumerable.Range(1, 5).Select(index => new WeatherForecast
                {
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
                }).ToArray();

                return Ok(data);
            }
            catch (Exception ex)
            {
                // Better error handling for development
                return Problem(
                    title: "Internal Server Error",
                    detail: ex.ToString(),
                    statusCode: 500);
            }
        }
    }
}
