using EMC.Server.BLL.DTOs;
using EMC.Server.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EMC.Server.Controllers
{
    /// <summary>
    /// Routes (inherited from LocalBaseController = api/[controller]/[action], [Authorize]):
    ///   GET  /api/Demo/Ping
    ///   GET  /api/Demo/GetDemoItems
    ///   GET  /api/Demo/GetDemoItemById/{id}
    /// </summary>
    public class DemoController(IDemoService demoService) : LocalBaseController
    {
        /// <summary>
        /// Lightweight authenticated ping to verify the JWT bearer flow works end-to-end.
        /// </summary>
        [HttpGet]
        public IActionResult Ping()
        {
            try
            {
                var dto = new DemoPingDTO
                {
                    Message           = "EMC.Server is reachable and the bearer token was accepted.",
                    ServerTimeUtc     = DateTime.UtcNow.ToString("o"),
                    AuthenticatedUser = User?.Identity?.Name
                };
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Returns the full mock demo-items list.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetDemoItems()
        {
            try
            {
                var items = await demoService.GetDemoItems();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Returns a single demo item by id.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetDemoItemById(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                    return BadRequest(new { message = "Id is required." });

                var item = await demoService.GetDemoItemById(id);
                if (item == null)
                    return NotFound(new { message = "Demo item not found." });

                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
