using EMC.Server.BLL.DTOs;

namespace EMC.Server.BLL.Interfaces
{
    public interface IDemoService
    {
        /// <summary>
        /// Returns a small in-memory list of demo items for connectivity testing.
        /// </summary>
        Task<List<DemoItemDTO>> GetDemoItems();

        /// <summary>
        /// Returns a single demo item by id, or null when not found.
        /// </summary>
        Task<DemoItemDTO?> GetDemoItemById(Guid id);
    }
}
