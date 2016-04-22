
namespace Footbet.Models.DomainModels
{
    public class League
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SportsEventId { get; set; }
        public string Guid { get; set; }
    }
}