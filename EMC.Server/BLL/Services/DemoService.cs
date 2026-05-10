using EMC.Server.BLL.DTOs;
using EMC.Server.BLL.Interfaces;

namespace EMC.Server.BLL.Services
{
    /// <summary>
    /// Mock demo service used to verify the Angular ⇄ .NET API call chain.
    /// Replace with a real Dataverse-backed service once auth + DI are confirmed working.
    /// </summary>
    public class DemoService : IDemoService
    {
        private static readonly List<DemoItemDTO> _items = new()
        {
            new DemoItemDTO
            {
                Id          = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Title       = "Onboard new client",
                Description = "Kick-off meeting and SOW signature for Initium Solutions.",
                Status      = "Active",
                CreatedOn   = DateTime.UtcNow.AddDays(-3)
            },
            new DemoItemDTO
            {
                Id          = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Title       = "Quarterly retainer review",
                Description = "Audit Platinum retainer hours and prepare Q1 report.",
                Status      = "Pending",
                CreatedOn   = DateTime.UtcNow.AddDays(-7)
            },
            new DemoItemDTO
            {
                Id          = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title       = "Release v2.4.0 to production",
                Description = "Deploy customer portal release with hotfix bundle.",
                Status      = "Completed",
                CreatedOn   = DateTime.UtcNow.AddDays(-14)
            }
        };

        public Task<List<DemoItemDTO>> GetDemoItems()
        {
            return Task.FromResult(_items.ToList());
        }

        public Task<DemoItemDTO?> GetDemoItemById(Guid id)
        {
            var item = _items.FirstOrDefault(x => x.Id == id);
            return Task.FromResult(item);
        }
    }
}
