using EMC.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace EMC.Server.Controllers
{
    public class WeatherForecastController : LocalBaseController
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var data = new WeatherForecast { TemperatureC = 0, Summary = "Freezing" };

                return Ok(data);
            }
            catch (Exception ex)
            {
                return Problem(
                    title: "Internal Server Error",
                    detail: ex.ToString(),
                    statusCode: 500);
            }
        }
    }
}
