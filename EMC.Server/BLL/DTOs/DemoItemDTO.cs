namespace EMC.Server.BLL.DTOs
{
    public class DemoItemDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Status { get; set; } = "";        // Active | Pending | Completed
        public DateTime CreatedOn { get; set; }
    }

    public class DemoPingDTO
    {
        public string Message { get; set; } = "";
        public string ServerTimeUtc { get; set; } = "";
        public string? AuthenticatedUser { get; set; }
    }
}
